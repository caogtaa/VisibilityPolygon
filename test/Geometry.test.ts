/*
 * Author: GT<caogtaa@gmail.com>
 * Date: 2021-02-24 18:06:47
 * LastEditors: GT<caogtaa@gmail.com>
 * LastEditTime: 2021-02-25 01:40:42
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

describe("Geometry.IsPointInPolygon", () => {
    test("inside test 1", () => {
        // case data:
        // https://doc.cgal.org/latest/Visibility_2/index.html
        expect(Geometry.IsPointInPolygon(
            cc.v2(0.5, 2),
            [cc.v2(0, 4), cc.v2(0, 0), cc.v2(3, 2), cc.v2(4, 0), cc.v2(4, 4), cc.v2(1, 2)]
        ))
        .toBe(true);
    });

    test("inside test 2", () => {
        expect(Geometry.IsPointInPolygon(
            cc.v2(3.5, 2.5),
            [cc.v2(0, 4), cc.v2(0, 0), cc.v2(3, 2), cc.v2(4, 0), cc.v2(4, 4), cc.v2(1, 2)]
        ))
        .toBe(true);
    });

    test("left side", () => {
        expect(Geometry.IsPointInPolygon(
            cc.v2(-0.5, 2),
            [cc.v2(0, 4), cc.v2(0, 0), cc.v2(3, 2), cc.v2(4, 0), cc.v2(4, 4), cc.v2(1, 2)]
        ))
        .toBe(false);
    });

    test("right side", () => {
        expect(Geometry.IsPointInPolygon(
            cc.v2(5.1, 2),
            [cc.v2(0, 4), cc.v2(0, 0), cc.v2(3, 2), cc.v2(4, 0), cc.v2(4, 4), cc.v2(1, 2)]
        ))
        .toBe(false);
    });

    test("outside but in concave", () => {
        expect(Geometry.IsPointInPolygon(
            cc.v2(1, 3),
            [cc.v2(0, 4), cc.v2(0, 0), cc.v2(3, 2), cc.v2(4, 0), cc.v2(4, 4), cc.v2(1, 2)]
        ))
        .toBe(false);
    });

    test("upward", () => {
        expect(Geometry.IsPointInPolygon(
            cc.v2(5.1, 2),
            [cc.v2(0, 4), cc.v2(0, 0), cc.v2(3, 2), cc.v2(4, 0), cc.v2(4, 4), cc.v2(1, 2)]
        ))
        .toBe(false);
    });

    test("on edge", () => {
        expect(Geometry.IsPointInPolygon(
            cc.v2(4, 1),
            [cc.v2(0, 4), cc.v2(0, 0), cc.v2(3, 2), cc.v2(4, 0), cc.v2(4, 4), cc.v2(1, 2)]
        ))
        .toBe(true);
    });

    test("on vertex", () => {
        expect(Geometry.IsPointInPolygon(
            cc.v2(1, 2),
            [cc.v2(0, 4), cc.v2(0, 0), cc.v2(3, 2), cc.v2(4, 0), cc.v2(4, 4), cc.v2(1, 2)]
        ))
        .toBe(true);
    });

    test("same max y", () => {
        expect(Geometry.IsPointInPolygon(
            cc.v2(5, 4),
            [cc.v2(0, 4), cc.v2(0, 0), cc.v2(3, 2), cc.v2(4, 0), cc.v2(4, 4), cc.v2(1, 2)]
        ))
        .toBe(false);
    });

    test("same min y", () => {
        expect(Geometry.IsPointInPolygon(
            cc.v2(9, 0),
            [cc.v2(0, 4), cc.v2(0, 0), cc.v2(3, 2), cc.v2(4, 0), cc.v2(4, 4), cc.v2(1, 2)]
        ))
        .toBe(false);
    });

    test("edge parallel with x", () => {
        expect(Geometry.IsPointInPolygon(
            cc.v2(4, 4),
            [cc.v2(0, 0), cc.v2(0, 3), cc.v2(3, 3), cc.v2(3, 0)]
        ))
        .toBe(false);
    });
});