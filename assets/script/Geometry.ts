/*
 * Author: GT<caogtaa@gmail.com>
 * Date: 2021-02-24 18:06:47
 * LastEditors: GT<caogtaa@gmail.com>
 * LastEditTime: 2021-02-25 01:28:44
*/



export enum EOrientation {
    RIGHT_TURN = -1,
    COLLINEAR = 0,
    LEFT_TURN = 1
}

export default class Geometry {
	protected static _epsilon = 1e-5;

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
        if (Math.abs(c) <= this._epsilon)
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
    protected static IsRayIntersect(o: cc.Vec2, p1: cc.Vec2, q1: cc.Vec2): boolean {
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

    public static IsPointInPolygon(o: cc.Vec2, polygon: cc.Vec2[]): boolean {
        let i = 0, k = 1, n = polygon.length;
        let acc = 0;
        for (; i < n; ++i, ++k) {
            if (k == n)
                k = 0;

            // 判断点和线段pi->pk的关系
            let pi = polygon[i];
            let pk = polygon[k];
            if (this.IsOnSegment(o, pi, pk)) {
                // 在边上则直接认为在多边形内部
                return true;
            }

            if (this.IsRayIntersect(o, pi, pk)) {
                ++ acc;
            }
        }

        return acc % 2 === 1;
    }
}
