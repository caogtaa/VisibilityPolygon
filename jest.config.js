/*
 * @Author: GT<caogtaa@gmail.com>
 * @Date: 2021-02-24 20:19:08
 * @LastEditors: GT<caogtaa@gmail.com>
 * @LastEditTime: 2021-02-24 20:39:41
 */

module.exports = {
  roots: ['./test'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__test__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    window: {},
    cc: {}
  }
}