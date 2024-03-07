const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./common.config');
const cssModuleRules = require('./cssModuleRules');

module.exports = merge(common, cssModuleRules, {
  mode: 'development', // 便于开发调试，排查报错堆栈
  entry: path.resolve(__dirname, '../server/index.tsx'),
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, '../dist'),
  },
  target: 'node', // 目标环境为 Node.js
});
