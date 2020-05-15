const path = require('path');
const corePath = path.join(__dirname, './core');
const utilsPath = path.join(__dirname, './src/utils');
const srcPath = path.join(__dirname, './src');
// https://github.com/babel/babel/issues/8321
require('@babel/polyfill');
require('@babel/register')({
  presets: [ '@babel/preset-env' ],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
    	{ legacy: true }
    ],
    // ['@babel/plugin-syntax-decorators', { decoratorsBeforeExport: true }],
    ["module-resolver", {
      "alias": {
        "@Core": corePath,
        "@Utils": utilsPath,
        "@Src": srcPath
      }
    }],
    ['@babel/plugin-proposal-class-properties', {loose: true}],
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-modules-commonjs'
  ]
});
