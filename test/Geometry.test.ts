/*
 * Author: GT<caogtaa@gmail.com>
 * Date: 2021-02-24 18:06:47
 * LastEditors: GT<caogtaa@gmail.com>
 * LastEditTime: 2021-02-26 16:24:44
*/

// 如需调用Cocos Creator的内部方法请参考
// http://slides.com/mangogan/jestxccc/fullscreen#/23/1
/*
npm install --save-dev @types/jest @types/node jest ts-jest typescript
npm i @babel/preset-typescript -D
npm i jest-canvas-mock -D
*/
// vscode插件安装Jest、Jest Test Explorer

import Geometry, { AngleComparer, EOrientation } from "../assets/script/Geometry";

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

    test("outside with same max y", () => {
        expect(Geometry.IsPointInPolygon(
            cc.v2(5, 4),
            [cc.v2(0, 4), cc.v2(0, 0), cc.v2(3, 2), cc.v2(4, 0), cc.v2(4, 4), cc.v2(1, 2)]
        ))
        .toBe(false);
    });

    test("outside with same min y", () => {
        expect(Geometry.IsPointInPolygon(
            cc.v2(9, 0),
            [cc.v2(0, 4), cc.v2(0, 0), cc.v2(3, 2), cc.v2(4, 0), cc.v2(4, 4), cc.v2(1, 2)]
        ))
        .toBe(false);
    });

    test("edge parallel with x axis", () => {
        expect(Geometry.IsPointInPolygon(
            cc.v2(4, 4),
            [cc.v2(0, 0), cc.v2(0, 3), cc.v2(3, 3), cc.v2(3, 0)]
        ))
        .toBe(false);
    });
});

describe("Geometry.AngleComparer.Cmp", () => {
    test("left & right", () => {
        // 右半平面先被扫描到
        expect(new AngleComparer(cc.v2(0, 0)).Cmp(cc.v2(-100, 100), cc.v2(100, 100))).toBeGreaterThan(0);
    });

    test("left & y", () => {
        // y轴（沿参考点向上）先被扫描到
        expect(new AngleComparer(cc.v2(100, 0)).Cmp(cc.v2(-100, 100), cc.v2(100, 100))).toBeGreaterThan(0);
    });

    test("y & right test 1", () => {
        // y上半轴先被扫描到
        expect(new AngleComparer(cc.v2(-100, 0)).Cmp(cc.v2(-100, 100), cc.v2(100, 100))).toBeLessThan(0);
    });

    test("y & right test 2", () => {
        // 右半平面先被扫描到，y下半轴后被扫描到
        expect(new AngleComparer(cc.v2(-100, 0)).Cmp(cc.v2(-100, -100), cc.v2(100, 100))).toBeGreaterThan(0);
    });

    test("collinear with y test 1", () => {
        // 都在上半平面，远处先扫描到
        expect(new AngleComparer(cc.v2(1, 1)).Cmp(cc.v2(1, 3), cc.v2(1, 4))).toBeGreaterThan(0);
    });

    test("collinear with y test 2", () => {
        // 一个在上半平面一个在下半平面
        expect(new AngleComparer(cc.v2(1, 1)).Cmp(cc.v2(1, 3), cc.v2(1, -4))).toBeLessThan(0);
    });

    test("collinear with y test 3", () => {
        // 都在下半平面，远处先扫描到
        expect(new AngleComparer(cc.v2(1, 1)).Cmp(cc.v2(1, -3), cc.v2(1, -4))).toBeGreaterThan(0);
    });

    test("collinear test 1", () => {
        expect(new AngleComparer(cc.v2(1, 1)).Cmp(cc.v2(2, 2), cc.v2(3, 3))).toBeGreaterThan(0);
    });

    test("collinear test 2", () => {
        expect(new AngleComparer(cc.v2(0, 0)).Cmp(cc.v2(-1, 1), cc.v2(-2, 2))).toBeGreaterThan(0);
    });

    test("normal case", () => {
        expect(new AngleComparer(cc.v2(0, 0)).Cmp(cc.v2(1, 4), cc.v2(2, 3))).toBeLessThan(0);
    });

    test("vertex overlap", () => {
        expect(new AngleComparer(cc.v2(0, 0)).Cmp(cc.v2(1, 1), cc.v2(1, 1))).toBe(0);
    });
});

describe("Geometry.RaySegmentIntersection", () => {
    test("parallel", () => {
        expect(Geometry.RaySegmentIntersection(cc.v2(0, 0), cc.v2(2, 3), cc.v2(1, 0), cc.v2(3, 3))).toBeNull();
    });

    test("parallel vertical", () => {
        expect(Geometry.RaySegmentIntersection(cc.v2(0, 0), cc.v2(0, 3), cc.v2(1, 0), cc.v2(1, 3))).toBeNull();
    });

    test("parallel horizontal", () => {
        expect(Geometry.RaySegmentIntersection(cc.v2(0, 0), cc.v2(3, 0), cc.v2(0, 1), cc.v2(3, 1))).toBeNull();
    });

    // 由于上层保证没有这个场景，处于性能考虑忽略这个判断
    // test("collinear", () => {
    // });

    test("intersect test 1", () => {
        // 射线的延长线会穿过线段中点
        expect(Geometry.RaySegmentIntersection(cc.v2(0, 0), cc.v2(0.1, 0.1), cc.v2(2, 0), cc.v2(0, 2)))
            .toEqual(cc.v2(1, 1));
    });

    test("intersect test 2", () => {
        // 线段穿过射线起始点
        expect(Geometry.RaySegmentIntersection(cc.v2(0, 0), cc.v2(0.1, 0.1), cc.v2(1, -1), cc.v2(-1, 1)))
            .toEqual(cc.v2(0, 0));
    });

    test("intersect test 3", () => {
        // 射线和线段不平行，但是相交
        expect(Geometry.RaySegmentIntersection(cc.v2(1, 0), cc.v2(0, 0.1), cc.v2(0, 0), cc.v2(4, 2)))
            .toEqual(cc.v2(1, 0.5));
    });

    test("not intersect test 1", () => {
        // 射线和线段不平行，不相交
        expect(Geometry.RaySegmentIntersection(cc.v2(1, 1), cc.v2(0, 0.1), cc.v2(0, 0), cc.v2(4, 2))).toBeNull();
    });

    test("collinear and disjoint", () => {
        // 射线往右，线段在左
        expect(Geometry.RaySegmentIntersection(cc.v2(1, 1), cc.v2(1, 0), cc.v2(0, 1), cc.v2(-1, 1))).toBeNull();
    });

    test("collinear and ray origin inside segment", () => {
        expect(Geometry.RaySegmentIntersection(cc.v2(1, 1), cc.v2(1, 0), cc.v2(0, 1), cc.v2(1.5, 1)))
            .toEqual(cc.v2(1, 1));
    });

    test("collinear and ray shooting segment", () => {
        // 返回先遇到的顶点
        expect(Geometry.RaySegmentIntersection(cc.v2(1, 1), cc.v2(0.1, 0), cc.v2(1.5, 1), cc.v2(2.5, 1)))
            .toEqual(cc.v2(1.5, 1));
    });

    test("collinear ray origin overlap endpoint", () => {
        // 射线往右，线段在左
        expect(Geometry.RaySegmentIntersection(cc.v2(2, 2), cc.v2(1, 1), cc.v2(1, 1), cc.v2(2, 2)))
            .toEqual(cc.v2(2, 2));
    });
});