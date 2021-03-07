/*
 * Author: GT<caogtaa@gmail.com>
 * Date: 2021-03-06 19:05:00
 * LastEditors: GT<caogtaa@gmail.com>
 * LastEditTime: 2021-03-07 21:46:04
*/

import VisibilityAssembler from "./VisibilityAssembler";


const {ccclass, property} = cc._decorator;

@ccclass
export default class VisibilityRenderer extends cc.Sprite {
    onLoad() {
    }

    // origin: 观察点
    // polygon: 可视多边形
    // 根据可是多边形的特点，以origin为顶点与polygon上的连续2点建立一个三角形，可以避免polygon的三角剖分
    public SetPolygon(origin: cc.Vec2, polygon: cc.Vec2[]) {
        //@ts-ignore
        let assembler: VisibilityAssembler = this._assembler;
        if (assembler) {
            assembler.origin = origin;
            assembler.polygon = polygon;
        }

        let material = this.getMaterial(0);
        if (material) {
            let node: cc.Node = this.node;
            let offsetX = node.width * node.anchorX;
            let offsetY = node.height * node.anchorY;

            // todo: 如果希望多个visibility polygon合批渲染，逻辑放入assembler
            // origin: 观察点，世界坐标，坐标系和assembler里的pos对齐（目前采用屏幕中心为原点）
            // radius: 可视半径，设计分辨率尺度
            material.setProperty("origin", [origin.x + offsetX, origin.y + offsetY]);
        }

        this.setVertsDirty();
    }

    public SetCircleFOV(value: boolean, radius: number = 100.0): void {
        let material = this.getMaterial(0);
        if (material) {
            material.define("GT_CIRCLE_FOV", value);
            material.setProperty("radius", radius);
        }
    }

    public SetRadarRing(value: boolean, radius: number = 360.0): void {
        let material = this.getMaterial(0);
        if (material) {
            material.define("GT_RADAR_RING", value);
            material.setProperty("radarRadius", radius);
        }
    }

    // public SetParticles(particles) {
    //     //@ts-ignore
    //     this._assembler.particles = particles;
    //     let material = this.getMaterial(0);
    //     if (particles && material) {
    //         let PTM_RATIO = cc.PhysicsManager.PTM_RATIO;
    //         if (CC_NATIVERENDERER) {
    //             // native渲染时以节点anchor为世界空间原点
    //             material.setProperty("offset", [0.5, 0.5]);
    //         } else {
    //             // web默认以左下为世界空间原点。两个平台内shader内通过offset实现坐标统一
    //             material.setProperty("offset", [0.0, 0.0]);
    //         }

    //         // particles.GetRadius() * PTM_RATIO 是相对于场景(世界空间)的大小
    //         // particles.GetRadius() * PTM_RATIO / this.node.width 是相对于纹理的大小(纹理和屏幕同宽)，范围[0, 1]
    //         material.setProperty("radius", particles.GetRadius() * PTM_RATIO / this.node.width);
    //         material.setProperty("yratio", this.node.height / this.node.width);
    //         material.setProperty("reverseRes", [1.0 / this.node.width, 1.0 / this.node.height]);
    //     }

    //     this.setVertsDirty();
    // }

    _resetAssembler() {
        this.setVertsDirty();
        let assembler = this._assembler = new VisibilityAssembler;
        assembler.init(this);
    }

    update() {
        this.setVertsDirty();
    }
}
