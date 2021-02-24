/*
 * @Author: GT<caogtaa@gmail.com>
 * @Date: 2021-02-24 20:19:08
 * @LastEditors: GT<caogtaa@gmail.com>
 * @LastEditTime: 2021-02-24 22:23:10
 */

module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__test__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  globals: {
    window: {},
    cc: {}
  },
  testEnvironment: 'jsdom',	
  transformIgnorePatterns: [
    'cocos2d-js-for-preview.js',
  ],
  setupFiles: [
    'jest-canvas-mock', // npm 套件只需要名稱
    '<rootDir>/test/utils/cocos2d-js-for-preview.js',
  ],
}