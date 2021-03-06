/*
 * Author: GT<caogtaa@gmail.com>
 * Date: 2021-03-06 19:05:00
 * LastEditors: GT<caogtaa@gmail.com>
 * LastEditTime: 2021-03-06 20:30:08
*/


//@ts-ignore
let gfx = cc.gfx;
var vfmtPosWeb = new gfx.VertexFormat([
    { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 }
]);

export default class VisibilityAssembler extends cc.Assembler {
    floatsPerVert = 2;

    public origin: cc.Vec2 = null;
    public polygon: cc.Vec2[] = null;

    protected _renderData: cc.RenderData = null;

    init(comp: cc.RenderComponent) {
        super.init(comp);

        this._renderData = new cc.RenderData();
        this._renderData.init(this);
    }

    // initData() {
    //     // do nothing
    // }

    updateColor(comp, color) {
        // do nothing
    }

    updateUVs(comp) {
        // do nothing
    }

    updateVerts(comp) {
        // web模式直接在fillbuffer里做所有操作，不经过RenderData缓存
    }

    getVfmt() {
        return vfmtPosWeb;
    }

    getBuffer() {
        //@ts-ignore
        return cc.renderer._handle.getBuffer("mesh", this.getVfmt());
    }

    fillBuffers(comp, renderer) {
        let origin = this.origin;
        let polygon = this.polygon;
        if (!origin || !polygon || polygon.length <= 2)
            return;

        let pointsCount = polygon.length;
        let verticesCount = 1 + pointsCount;          // 观察点origin + 多边形顶点加
        let indicesCount = pointsCount * 3;           // 多边形上每两个相邻点和观察点origin组成一个三角形

        let node: cc.Node = comp.node;
        let offsetX = node.width * node.anchorX;
        let offsetY = node.height * node.anchorY;

        //@ts-ignore
        let buffer = this.getBuffer(/*renderer*/);
        let offsetInfo = buffer.request(verticesCount, indicesCount);

        // fill vertices
        // 暂时不考虑buffer满的情况
        let vertexOffset = offsetInfo.byteOffset >> 2,
            vbuf = buffer._vData;

        // todo: x, y的offset运算放到GPU
        vbuf[vertexOffset++] = origin.x + offsetX;
        vbuf[vertexOffset++] = origin.y + offsetY;
        for (let p of polygon) {
            vbuf[vertexOffset++] = p.x + offsetX;
            vbuf[vertexOffset++] = p.y + offsetY;
        }

        // fill indices
        let ibuf = buffer._iData,
        indiceOffset = offsetInfo.indiceOffset,
        vertexId = offsetInfo.vertexOffset;             // vertexId是已经在buffer里的顶点数，也是当前顶点序号的基数

        let originVertexId = vertexId;

        // 先处理首尾两点和原点的三角形
        ibuf[indiceOffset++] = originVertexId;
        ibuf[indiceOffset++] = originVertexId + pointsCount;
        ibuf[indiceOffset++] = originVertexId + 1;

        for (let i = 1; i < pointsCount; ++i) {
            ibuf[indiceOffset++] = originVertexId;      // 原点
            ibuf[indiceOffset++] = originVertexId + i;
            ibuf[indiceOffset++] = originVertexId + i + 1;
        }
    }
}
