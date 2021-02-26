/*
 * Author: GT<caogtaa@gmail.com>
 * Date: 2020-08-02 19:43:53
 * LastEditors: GT<caogtaa@gmail.com>
 * LastEditTime: 2021-02-27 01:05:32
*/

import Geometry from "./Geometry";
import MeshPolygonSprite from "./MeshPolygonSprite";

//@ts-ignore
const VisibilityPolygon = require("./visibility_polygon.js");

const { ccclass, property } = cc._decorator;



@ccclass
export default class SceneMain extends cc.Component {
    @property(cc.Graphics)
    graphics: cc.Graphics = null;

    @property(MeshPolygonSprite)
    polygonSprite: MeshPolygonSprite = null;

    @property(cc.Node)
    viewPoint: cc.Node = null;

    protected _epsilon: number = 1e-5;

    onLoad() {

        // let vp = new VisibilityPolygon;

        // var polygons = [];
        // polygons.push([[-1,-1],[250.5,-1],[250.5,250.5],[-1,250.5]]);
        // polygons.push([[125.5, 50],[130, 70], [120, 70]]);
        // var segments = VisibilityPolygon.convertToSegments(polygons);
        // segments = VisibilityPolygon.breakIntersections(segments);
        // var position = [30, 30];

        // let result;
        // if (VisibilityPolygon.inPolygon(position, polygons[0])) {
        //     result = VisibilityPolygon.compute(position, segments);
        // } else {
        //     // 在矩形区域内的visibility_polygon
        //     result = VisibilityPolygon.computeViewport(position, segments, [25, 25], [225, 225]);
        //     console.log(result);
        // }

        // let graphics = this.graphics;
        // graphics.strokeColor = cc.Color.WHITE;
        // this.DrawPolygon(polygons[0]);
        // graphics.stroke();

        // this.DrawPolygon(polygons[1]);
        // graphics.stroke();

        // graphics.fillColor = cc.Color.GREEN;
        // this.DrawPolygon(result);
        // graphics.fill();

        // graphics.fillColor = cc.Color.RED;
        // graphics.circle(position[0], position[1], 5);
        // graphics.fill();
    }

    // public DrawPolygon(polygon: any[]): void {
    //     if (polygon.length === 0)
    //         return;

    //     let graphics = this.graphics;
    //     let p0 = polygon[0];
    //     graphics.moveTo(p0[0], p0[1]);

    //     for (let i = 1, n = polygon.length; i < n; ++i) {
    //         let pi = polygon[i];
    //         graphics.lineTo(pi[0], pi[1]);
    //     }

    //     graphics.close();
    //     // graphics.stroke();
    // }

    public DrawPolygon(polygon: cc.Vec2[]): void {
        if (polygon.length === 0)
            return;

        let graphics = this.graphics;
        let p0 = polygon[0];
        graphics.moveTo(p0.x, p0.y);

        for (let i = 1, n = polygon.length; i < n; ++i) {
            let pi = polygon[i];
            graphics.lineTo(pi.x, pi.y);
        }

        graphics.close();
    }

    update() {
        // todo: if nothing dirty, return

        let graphics = this.graphics;
        graphics.clear();
        let polygon = this.polygonSprite.vertexes;

        let o = this.viewPoint.position;
        let visibility = Geometry.VisibilityPolygon(o, polygon);

        this.DrawPolygon(visibility);
        graphics.fill();

        // graphics.fillColor = cc.Color.GREEN;
        // this.DrawPolygon(result);
        // graphics.fill();

        // graphics.fillColor = cc.Color.RED;
        // graphics.circle(position[0], position[1], 5);
        // graphics.fill();
    }
}
