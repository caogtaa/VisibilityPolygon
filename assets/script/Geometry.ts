/*
 * Author: GT<caogtaa@gmail.com>
 * Date: 2021-02-24 18:06:47
 * LastEditors: GT<caogtaa@gmail.com>
 * LastEditTime: 2021-02-26 20:55:41
*/

import Heap from "./Heap";

export class AngleComparator
{
    protected _o: cc.Vec2;
    constructor(o: cc.Vec2) {
        this._o = o;
    }

    // 此处的比较函数以从o点出发y轴正方向射线为起点，顺时针扫描一周
    // 比较的时候注意边缘case：y轴经过两次（正方向、负方向）后才轮到左半平面的点
    public Cmp(a: cc.Vec2, b: cc.Vec2): number {
        let eps = 1e-5;
        let o = this._o;
        let axDelta = a.x - o.x;
        if (Math.abs(axDelta) <= eps)
            axDelta = 0;
        else
            axDelta = axDelta < 0 ? -1 : 1;

        let bxDelta = b.x - o.x;
        if (Math.abs(bxDelta) <= eps)
            bxDelta = 0;
        else
            bxDelta = bxDelta < 0 ? -1 : 1;

        // 如果a/b一个在左半平面（不含y轴），一个在右半平面（含y轴）,则右侧的先扫描到
        // 注意一个在y轴上，一个在右半平面（不含y轴）的情况将在最后一个分支里讨论
        if (axDelta !== bxDelta && (axDelta === -1 || bxDelta === -1)) {
            // js版本的cmp和C返回值相同(<0 / 0 / >0)
            // x比较大的（在右侧）排前面
            return bxDelta - axDelta;
        }

        // yDelta不需要规范化到(-1/0/1)，并且predicate过程不需要eps参与
        let ayDelta = a.y - o.y;
        let byDelta = b.y - o.y;

        // 此处必然axDelta === bxDelta
        // 如果aob共线并和y轴平行
        if (axDelta === 0 && bxDelta === 0) {
            // 如果ab都在上半平面或者有一个在上半平面，y大的（离o远）先被扫描到
            // 这里就包括了一上一下时上半平面的点先被扫描到
            if (ayDelta >= 0 || byDelta >= 0) {
                return byDelta - ayDelta;
            }

            // ab都在o点下半平面，y小的（离o远）点排序优先
            // return a.y - b.y;        // 使用下方等价方法减少成员访问
            return ayDelta - byDelta;
        }

        // 到这里为止，a和b都在左平面或者都在右平面，或者其中有一个和o垂直共线
        axDelta = a.x - o.x;
        bxDelta = b.x - o.x;

        // let corss = (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
        let cross = axDelta * byDelta - ayDelta * bxDelta;

        // 如果oab共线
        if (Math.abs(cross) <= eps) {
            // 取离v点较远的点优先
            // 远近优先的选择并不影响结果的正确性，但是无论怎么选择都可能在某一个象限出现needle现象
            // 在最后的共线点过滤环节可以去掉这个needle
            // return length_squared(b - o) - length_squared(a - o)
            return (bxDelta * bxDelta + byDelta * byDelta) - (axDelta * axDelta + ayDelta * ayDelta);
        }

        // 如果b在oa右侧，cross < 0; a先扫到，返回 < 0
        // 如果b在oa左侧，corss > 0; b先扫到，返回 > 0
        return cross;
    }
}


export class SegmentComparator {
    protected static _epsilon: number = 1e-5;
    protected _o: cc.Vec2;
    constructor(o: cc.Vec2) {
        this._o = o;
    }

    protected static ApproxEqualVec2(a: cc.Vec2, b: cc.Vec2): boolean {
        let eps = SegmentComparator._epsilon;
        return Math.abs(a.x - b.x) <= eps && Math.abs(a.y - b.y) <= eps;
    }

    // protected _tmpV2: cc.Vec2 = null;
    public Cmp(x: Segment, y: Segment): number {
        let a = x._a, b = x._b;
        let c = y._a, d = y._b;

        let o = this._o;
        // let eps = Geometry._epsilon;

        let ApproxEqualVec2 = SegmentComparator.ApproxEqualVec2;
        
        // 如果ab/cd有公共顶点，将该顶点交换到a/c
        if (ApproxEqualVec2(b, c) || ApproxEqualVec2(b, d)) {
            let tmp = a;
            a = b;
            b = tmp;
        }

        if (ApproxEqualVec2(a, d))  {
            let tmp = c;
            c = d;
            d = tmp;
        }

        let Orientation = Geometry.Orientation;

        // 有公共顶点的情况
        if (ApproxEqualVec2(a, c)) {
            let oad = Orientation(o, a, d);
            let oab = Orientation(o, a, b);
            if (oad != oab || ApproxEqualVec2(b, d)) {
                // 如果ab/cd几乎重合，那么两者顺序不变
                // oad != oab的情况不应该出现。原因：
                // 1. 简单衔接的线段（扫描时无折角），end_event会先执行，左右两侧线段不会同时出现在堆里
                // 2. 其中一个线段和o共线的情况，在外部会排除掉
                return 0;
            }

            // abd不可能共线，因为当前是折角的case
            // abo不可能共线，因为外部会排除掉
            // 如果abd和abo方向相反，说明b处于o和d之间，那么ab离o更近
            if (Orientation(a, b, d) != Orientation(a, b, o))
                return -1;

            return 1;
        }

        // 无公共顶点的情况
        let cda = Orientation(c, d, a);
        let cdb = Orientation(c, d, b);
        if (cda === EOrientation.COLLINEAR && cdb === EOrientation.COLLINEAR) {
            // 四点共线，不可能出现
            // return distance_squared(origin, a) - distance_squared(origin, c);
            return 0;
        } else if (cda === cdb
            || cda === EOrientation.COLLINEAR
            || cdb === EOrientation.COLLINEAR) {
            // ab在cd的同一侧
            // 如果o和ab都在cd的同一侧，则说明ab在前面
            let cdo = Orientation(c, d, o);
            if (cdo === cda || cdo === cdb)
                return -1;

            return 1;
        }

        // a/b在cd线段的两侧
        // 检查abo和abc的方向，画图比较好理解
        if (Orientation(a, b, o) !== Orientation(a, b, c))
            return -1;

        return 1;
    }
}

export class Segment {
    constructor(a: cc.Vec2, b: cc.Vec2) {
        this._a = a;
        this._b = b;
    }

    public _a: cc.Vec2;
    public _b: cc.Vec2;
}

export enum EOrientation {
    RIGHT_TURN = -1,
    COLLINEAR = 0,
    LEFT_TURN = 1
}

export default class Geometry {
	public static _epsilon = 1e-5;

    public static add(a: number, b: number): number {
        return a + b;
    }

    // less or equal with epsilon
    public static ApproxLessEqualNumber(x: number, y: number): boolean {
        return x - y <= this._epsilon;
    }

    public static ApproxGreatEqualNumber(x: number, y: number): boolean {
        return x - y >= -this._epsilon;
    }

    public static ApproxIsInRangeNumber(x: number, a: number, b: number): boolean {
        return a - x <= this._epsilon && x - b <= this._epsilon;
    }

    public static ApproxLessEqualPoint(p: cc.Vec2, q: cc.Vec2): boolean {
        return p.x - q.x <= this._epsilon &&
            p.y - q.y <= this._epsilon;
    }

    public static ApproxGreatEqualPoint(p: cc.Vec2, q: cc.Vec2): boolean {
        return p.x - q.x >= -this._epsilon &&
            p.y - q.y >= -this._epsilon;
    }

	// 检测点o是否在p, q线段的AABB内
    public static ApproxIsInRangePoint(o: cc.Vec2, p: cc.Vec2, q: cc.Vec2): boolean {
        let eps = this._epsilon;
        let ox = o.x, oy = o.y;
		let minx = Math.min(p.x, q.x);
		let maxx = Math.max(p.x, q.x);
		let miny = Math.min(p.y, q.y);
		let maxy = Math.max(p.y, q.y);
        return minx - ox <= eps && ox - maxx <= eps &&
            miny - oy <= eps && oy - maxy <= eps;
    }

    // 计算两个向量的叉积
    public static Cross(u: cc.Vec2, v: cc.Vec2): number {
        return u.x * v.y - u.y * v.x;
    }

    public static Dot(u: cc.Vec2, v: cc.Vec2): number {
        return u.x * v.x + u.y * v.y;
    }

    // 判断点o是否在pq线段上
    public static IsOnSegment(o: cc.Vec2, p: cc.Vec2, q: cc.Vec2): boolean {
        return this.ApproxIsInRangePoint(o, p, q) && 
			this.Orientation(o, p, q) == EOrientation.COLLINEAR;
    }

    // 检测点q在向量op左侧/右侧/共线
    // 等价于检测oq是op沿o逆时针/顺时针旋转
    public static Orientation(o: cc.Vec2, p: cc.Vec2, q: cc.Vec2): EOrientation {
        // 如果想要使用cross()，考虑增加两个临时变量保存向量sub结果
        let c = (p.x - o.x) * (q.y - o.y) - (p.y - o.y) * (q.x - o.x);
        if (Math.abs(c) <= Geometry._epsilon)
            return EOrientation.COLLINEAR;

        return c > 0 ? EOrientation.LEFT_TURN : EOrientation.RIGHT_TURN;
    }

	// 判断线段p1->q1和线段p2->q2是否相交
	public static IsSegmentIntersect(p1: cc.Vec2, q1: cc.Vec2, p2: cc.Vec2, q2: cc.Vec2): boolean {
        let eps = this._epsilon;
        let max = Math.max;
        let min = Math.min;

        // 先对AABB是否碰撞做快速检测
        if (max(p1.x, q1.x) + eps < min(p2.x, q2.x) ||
            max(p2.x, q2.x) + eps < min(p1.x, q1.x) ||
            max(p1.y, q1.y) + eps < min(p2.y, q2.y) ||
            max(p2.y, q2.y) + eps < min(p1.y, q1.y))
            return false;

        // 检测线段A顶点在线段B的两侧，反之亦然
        // 一旦出现共线的情况，结合上面AABB测试结果，可以认定有交点
		return this.Orientation(p1, q1, p2) * this.Orientation(p1, q1, q2) <= 0 &&
			this.Orientation(p2, q2, p1) * this.Orientation(p2, q2, q1) <= 0;
	}

    // 判断线段p1->q1是否和从o点向左发射射线相交
    // 和顶点相交是特殊情况，这里只认和线段y坐标比较大的顶点相交的情况，避免重复计算
    // o点在线段上的情况认为相交
    // 由于o点在多边形左侧边上时，会被判定为不在多边形内部
    // 为了解决这个对称性问题，请在射线检测法前先判断点是否在某一边上，如果是则直接判为在多边形内部
    // 在游戏运行期间要避免viewpoint刚好处于某条边上（通过碰撞检测预防这一帧发生）
    protected static IsLeftwardRayIntersect(o: cc.Vec2, p1: cc.Vec2, q1: cc.Vec2): boolean {
        let eps = this._epsilon;

        // 保证b是线段两个点里y较小的
        let b = p1, t = q1;
        if (b.y > t.y) {
            b = q1;
            t = p1;
        }

        let oy = o.y;
        // b.y < oy <= t.y (oy在线段y区间内且不能碰到低点y)
        // o必须处于bt线段右侧
        return b.y + eps < oy && oy - t.y <= eps
            && this.Orientation(b, t, o) == EOrientation.RIGHT_TURN;
	}

    // 可参考engine/cocos2d/core/collider/CCIntersection.js进行简化
    // return cc.Intersection.pointInPolygon(o, polygon);
    // 引擎版本对于o在边上、o和endpoint重叠的处理不同
    public static IsPointInPolygon(o: cc.Vec2, polygon: cc.Vec2[]): boolean {
        let n = polygon.length;
        let i = 0, k = n-1;
        let acc = 0;
        for (; i < n; k = i++) {
            // 判断点和线段pi->pk的关系
            let pi = polygon[i];
            let pk = polygon[k];
            if (this.IsOnSegment(o, pi, pk)) {
                // 在边上则直接认为在多边形内部
                return true;
            }

            if (this.IsLeftwardRayIntersect(o, pi, pk)) {
                ++ acc;
            }
        }

        return acc % 2 === 1;
    }

    // return the intersectio of ray p+tr and segment (q, qs) (or q+us in another presentation)
    // return null if they do not intersect
    // https://stackoverflow.com/questions/14307158/how-do-you-check-for-intersection-between-a-line-segment-and-a-line-ray-emanatin
    // https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/565282#565282
    // 整个计算过程不会产生新的v2对象，外部使用时注意不要长期持有返回值
    protected static _tmpV2_1: cc.Vec2 = cc.v2(0, 0);
    protected static _tmpV2_2: cc.Vec2 = cc.v2(0, 0);

    public static RaySegmentIntersection(p: cc.Vec2, r: cc.Vec2, q: cc.Vec2, qs: cc.Vec2): cc.Vec2 {
        let tmp1 = this._tmpV2_1;
        let tmp2 = this._tmpV2_2;

        let eps = this._epsilon;
        let s = qs.sub(q, tmp1);        // tmp1被s引用，注意不要覆盖
        let rxs = this.Cross(r, s);

        if (Math.abs(rxs) <= eps) {
            // 平行/共线，属于比较少的情况，允许计算稍微繁琐点
            let cross2 = this.Cross(q.sub(p, tmp2), r);     // tmp2马上丢弃
            if (Math.abs(cross2) <= eps) {
                // 共线
                // 通过点积计算线段两点相对于射线的方向，为正时同向，为负时反向
                let pqDir = this.Dot(q.sub(p, tmp2), r);    // tmp2马上丢弃
                if (Math.abs(pqDir) <= eps)
                    pqDir = 0;

                let pqsDir = this.Dot(qs.sub(p, tmp2), r);  // tmp2马上丢弃
                if (Math.abs(pqsDir) <= eps)
                    pqsDir = 0;

                if (pqDir < 0 && pqsDir < 0) {
                    // 线段两点都在射线的反方向，不相交
                    return null;
                } else if (pqDir * pqsDir <= 0) {
                    // 线段两点在射线的不同方向上，或顶点和射线起始点相交，说明射线原点处于线段上
                    return p;
                } else if (pqDir > pqsDir) {
                    // 此时q, qs都在射线同方向上
                    // qs点比较近
                    return qs;
                }

                // pqDir <= pqsDir, q点比较近
                return q;
            }

            // 平行
            return null;
        }

        let pq = q.sub(p, tmp2);        // tmp2倍pq引用
        let u = this.Cross(pq, r) / rxs;
        if (u + eps < 0 || 1 + eps < u) {
            // u不在区间[0, 1]内
            return null;
        }

        let t = this.Cross(pq, s) / rxs;
        if (t + eps < 0) {
            // t不在区间[0, +INFINITE]内
            return null;
        }

        // 相交
        // return p + tr
        let result = r.mul(t, tmp2);    // pq已经没用，可以安全使用tmp2
        result.addSelf(p);
        return result;
    }

    public static VisibilityPolygon(o: cc.Vec2, polygon: cc.Vec2[]): cc.Vec2[] {
        let segments: Segment[] = [];
        let n = polygon.length;
        let i = 0, k = n-1;
        for (; i < n; k=i++) {
            segments.push(new Segment(polygon[k], polygon[i]));
        }

        return this.VisibilityPolygonWithSegments(o, segments);
    }

    public static VisibilityPolygonWithSegments(o: cc.Vec2, segments: Segment[]): cc.Vec2[] {
        let segmentCmp = new SegmentComparator(o);
        let heap = new Heap(segmentCmp.Cmp.bind(segmentCmp));
        

        return [];
    }
}
