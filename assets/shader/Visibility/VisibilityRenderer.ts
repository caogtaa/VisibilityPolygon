/*
 * Author: GT<caogtaa@gmail.com>
 * Date: 2021-03-06 19:05:00
 * LastEditors: GT<caogtaa@gmail.com>
 * LastEditTime: 2021-03-06 19:35:47
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

        this.setVertsDirty();
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
