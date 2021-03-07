/*
 * Author: GT<caogtaa@gmail.com>
 * Date: 2020-08-02 19:43:53
 * LastEditors: GT<caogtaa@gmail.com>
 * LastEditTime: 2021-03-07 21:48:02
*/

import VisibilityRenderer from "../shader/Visibility/VisibilityRenderer";
import Geometry, { Segment } from "./Geometry";
import MeshPolygonSprite from "./MeshPolygonSprite";

const { ccclass, property } = cc._decorator;



@ccclass
export default class SceneMain extends cc.Component {
    @property(cc.Graphics)
    graphics: cc.Graphics = null;

    @property(VisibilityRenderer)
    visibilityRenderer: VisibilityRenderer = null;

    @property([MeshPolygonSprite])
    obstacles: MeshPolygonSprite[] = [];

    @property(cc.Node)
    viewPoint: cc.Node = null;

    @property(cc.Node)
    boundary: cc.Node = null;

    @property(cc.Node)
    btnCircleFOV: cc.Node = null;

    @property(cc.Node)
    btnUnlimitFOV: cc.Node = null;

    @property(cc.Node)
    btnRadar: cc.Node = null;

    protected _epsilon: number = 1e-5;

    onLoad() {
        let renderer = this.visibilityRenderer;
        this.btnCircleFOV?.on("click", () => {
            renderer?.SetCircleFOV(true);
        });

        this.btnUnlimitFOV?.on("click", () => {
            renderer?.SetCircleFOV(false);
        });

        let enableRadar: boolean = false;
        this.btnRadar?.on("click", () => {
            enableRadar = !enableRadar;
            renderer?.SetRadarRing(enableRadar);
        });

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

        // convert boundary
        let boundary = this.boundary;
        let l = boundary.x - boundary.anchorX * boundary.width,
            r = boundary.x + boundary.anchorX * boundary.width,
            t = boundary.y + boundary.anchorY * boundary.height,
            b = boundary.y - boundary.anchorY * boundary.height;

        let segments: Segment[] = [];
        // convert holes/obstacles
        for (let ob of this.obstacles) {
            let polygon = ob.vertexes;
            Geometry.PolygonToSegments(polygon, segments);
        }

        // extend boundary to prevent obstacle/boundary from overlapping
        let shouldExtendBoundary: boolean = true;
        if (shouldExtendBoundary) {
            for (let ob of this.obstacles) {
                let polygon = ob.vertexes;
                for (let p of polygon) {
                    if (p.x < l) {
                        l = p.x;
                    } else if (p.x > r) {
                        r = p.x;
                    }
    
                    if (p.y < b) {
                        b = p.y;
                    } else if (p.y > t) {
                        t = p.y;
                    }
                }
            }

            l -= 1;
            r += 1;
            b -= 1;
            t += 1;
        }

        let boundaryVertex: cc.Vec2[] = [];
        boundaryVertex.push(cc.v2(l, b));
        boundaryVertex.push(cc.v2(r, b));
        boundaryVertex.push(cc.v2(r, t));
        boundaryVertex.push(cc.v2(l, t));
        Geometry.PolygonToSegments(boundaryVertex, segments);

        let o = this.viewPoint.position;
        let visibility = Geometry.VisibilityPolygonWithSegments(o, segments);

        // graphics画法
        // let graphics = this.graphics;
        // graphics.clear();
        // this.DrawPolygon(visibility);
        // graphics.fill();

        // shader画法
        let renderer = this.visibilityRenderer;
        renderer.SetPolygon(o, visibility);
    }
}
