const { resolve } = require('path');
const { DefinePlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const { DIST, SRC } = require('./constants');
const cssModuleRules = require('./cssModuleRules');

module.exports = merge(cssModuleRules, {
  mode: 'production',
  output: {
    path: DIST,
    publicPath: 'http://localhost:3000/',
    filename: '[name].[contenthash].js',
  },
  optimization: {
    moduleIds: 'deterministic',
    // https://webpack.js.org/configuration/optimization/#optimizationruntimechunk
    // 指定是否将Webpack的运行时（每个文件中重复的、用于加载的函数）拆分为独立文件，能减少重复代码。
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all', // 指定vendors区块包含同步、异步加载的2类模块。
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
      new CleanWebpackPlugin(),
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: resolve(SRC, '404.html'),
          to: DIST,
        },
      ],
      options: {
        concurrency: 100,
      },
    }),
    new DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
});
