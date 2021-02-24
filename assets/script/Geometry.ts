/*
 * Author: GT<caogtaa@gmail.com>
 * Date: 2021-02-24 18:06:47
 * LastEditors: GT<caogtaa@gmail.com>
 * LastEditTime: 2021-02-24 20:32:21
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
		return this.Orientation(p1, q1, p2) !== this.Orientation(p1, q1, q2) &&
			this.Orientation(p2, q2, p1) !== this.Orientation(p2, q2, q1);
	}
}

module.exports = Geometry;
