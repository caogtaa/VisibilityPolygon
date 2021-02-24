/*
 * Author: GT<caogtaa@gmail.com>
 * Date: 2021-02-24 18:06:47
 * LastEditors: GT<caogtaa@gmail.com>
 * LastEditTime: 2021-02-24 20:34:18
*/

import Geometry from "../assets/script/Geometry";

describe("Geometry.add", () => {
    test("simple add", () => {
        expect(Geometry.add(2, 3)).toBe(5);
    });

    test("error add", () => {
        expect(Geometry.add(9, 3)).toBe(12);
    });
});
