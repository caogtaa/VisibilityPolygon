/*
 * Author: GT<caogtaa@gmail.com>
 * Date: 2021-02-24 18:06:47
 * LastEditors: GT<caogtaa@gmail.com>
 * LastEditTime: 2021-02-25 00:35:31
*/

// 如需调用Cocos Creator的内部方法请参考
// http://slides.com/mangogan/jestxccc/fullscreen#/23/1
/*
npm install --save-dev @types/jest @types/node jest ts-jest typescript
npm i @babel/preset-typescript -D
npm i jest-canvas-mock -D
*/
// vscode插件安装Jest、Jest Test Explorer

import Geometry, { EOrientation } from "../assets/script/Geometry";

describe("Geometry.add", () => {
    test("simple add", () => {
        expect(Geometry.add(2, 3)).toBe(5);
    });
});

describe("Geometry.Orientation", () => {
    test("collinear test 1", () => {
        expect(Geometry.Orientation(
            cc.v2(0, 0.3),
            cc.v2(1, 0.6),
            cc.v2(2, 0.9)
        ))
        .toBe(EOrientation.COLLINEAR);
    });

    test("collinear test 2", () => {
        expect(Geometry.Orientation(
            cc.v2(0, 1.0/3.0),
            cc.v2(1, 2.0/3.0),
            cc.v2(2, 1)
        ))
        .toBe(EOrientation.COLLINEAR);
    });

    test("collinear test 3", () => {
        expect(Geometry.Orientation(
            cc.v2(0, 0),
            cc.v2(1, 1),
            cc.v2(2, 2)
        ))
        .toBe(EOrientation.COLLINEAR);
    });

    test("collinear test 4: on edge", () => {
        expect(Geometry.Orientation(
            cc.v2(0, 0),
            cc.v2(1, 1),
            cc.v2(1, 1)
        ))
        .toBe(EOrientation.COLLINEAR);
    });

    test("left test 1", () => {
        expect(Geometry.Orientation(
            cc.v2(-1, -1),
            cc.v2(1, 1),
            cc.v2(1, 2)
        ))
        .toBe(EOrientation.LEFT_TURN);
    });

    test("right test 1", () => {
        expect(Geometry.Orientation(
            cc.v2(-1, -1),
            cc.v2(1, 1),
            cc.v2(1, 0)
        ))
        .toBe(EOrientation.RIGHT_TURN);
    });
});

describe("Geometry.IsSegmentIntersect", () => {
    test("connected by endpoint", () => {
        expect(Geometry.IsSegmentIntersect(
            cc.v2(-1, -1),
            cc.v2(250.5, 300),
            cc.v2(250.5, 300),
            cc.v2(900, 1000)
        ))
        .toBe(true);
    });

    test("overlapped", () => {
        expect(Geometry.IsSegmentIntersect(
            cc.v2(-1, -1),
            cc.v2(250.5, 250.5),
            cc.v2(-1, -1),
            cc.v2(900, 900)
        ))
        .toBe(true);
    });

    test("collinear but disjoint", () => {
        expect(Geometry.IsSegmentIntersect(
            cc.v2(-1, -1),
            cc.v2(100, 100),
            cc.v2(101, 101),
            cc.v2(900, 900)
        ))
        .toBe(false);
    });

    test("parallel", () => {
        // 第1条线段y-1平移得到第2条线段
        expect(Geometry.IsSegmentIntersect(
            cc.v2(-1, -1),
            cc.v2(250.5, 250.5),
            cc.v2(-1, -2),
            cc.v2(250.5, 249.5)
        ))
        .toBe(false);
    });
});