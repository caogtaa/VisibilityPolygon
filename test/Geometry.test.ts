/*
 * Author: GT<caogtaa@gmail.com>
 * Date: 2021-02-24 18:06:47
 * LastEditors: GT<caogtaa@gmail.com>
 * LastEditTime: 2021-02-24 22:25:25
*/

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
});

