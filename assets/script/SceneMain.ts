/*
 * Author: GT<caogtaa@gmail.com>
 * Date: 2020-08-02 19:43:53
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-02-24 18:19:38
*/

//@ts-ignore
const VisibilityPolygon = require("./visibility_polygon.js");

const { ccclass, property } = cc._decorator;



@ccclass
export default class SceneMain extends cc.Component {
    @property(cc.Graphics)
    graphics: cc.Graphics = null;

    protected _epsilon: Number = 1e-5;

    onLoad() {

        // let vp = new VisibilityPolygon;

        var polygons = [];
        polygons.push([[-1,-1],[250.5,-1],[250.5,250.5],[-1,250.5]]);
        polygons.push([[125.5, 50],[130, 70], [120, 70]]);
        var segments = VisibilityPolygon.convertToSegments(polygons);
        segments = VisibilityPolygon.breakIntersections(segments);
        var position = [30, 30];

        let result;
        if (VisibilityPolygon.inPolygon(position, polygons[0])) {
            result = VisibilityPolygon.compute(position, segments);
        } else {
            // 在矩形区域内的visibility_polygon
            result = VisibilityPolygon.computeViewport(position, segments, [25, 25], [225, 225]);
            console.log(result);
        }

        let graphics = this.graphics;
        graphics.strokeColor = cc.Color.WHITE;
        this.DrawPolygon(polygons[0]);
        graphics.stroke();

        this.DrawPolygon(polygons[1]);
        graphics.stroke();

        graphics.fillColor = cc.Color.GREEN;
        this.DrawPolygon(result);
        graphics.fill();

        graphics.fillColor = cc.Color.RED;
        graphics.circle(position[0], position[1], 5);
        graphics.fill();
    }

    public DrawPolygon(polygon: any[]) {
        if (polygon.length === 0)
            return;

        let graphics = this.graphics;
        let p0 = polygon[0];
        graphics.moveTo(p0[0], p0[1]);

        for (let i = 1, n = polygon.length; i < n; ++i) {
            let pi = polygon[i];
            graphics.lineTo(pi[0], pi[1]);
        }

        graphics.close();
        // graphics.stroke();
    }

}
