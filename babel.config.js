/*
 * @Author: your name
 * @Date: 2021-02-24 21:53:20
 * @LastEditTime: 2021-02-24 21:53:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \enginef:\workspace\visibility-polygon\babel.config.js
 */

module.exports = {
  plugins:['./babel_plugin/babel-cc-class.js'],
  presets: [
      [
      '@babel/preset-env',
      {
        targets: {
            node: 'current',
        },
      },
    ],
  ],
  ignore: [
      '**/cocos2d-js-for-preview.js',
  ]
};
