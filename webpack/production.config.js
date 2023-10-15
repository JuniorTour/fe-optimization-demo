const { resolve } = require('path');
const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const crypto = require('crypto');
const path = require('path');
const { DIST, SRC } = require('./constants');

const MAX_REQUEST_NUM = 20;
// 指定一个 module 可以被拆分为独立 区块（chunk） 的最小源码体积（单位：byte）
const MIN_LIB_CHUNK_SIZE = 10 * 1000;

const isModuleCSS = (module) => {
  return (
    // mini-css-extract-plugin
    module.type === `css/mini-extract` ||
    // extract-css-chunks-webpack-plugin (old)
    module.type === `css/extract-chunks` ||
    // extract-css-chunks-webpack-plugin (new)
    module.type === `css/extract-css-chunks`
  );
};

module.exports = {
  mode: 'production',
  output: {
    path: DIST,
    publicPath: 'http://localhost:3000/',
    filename: '[name].[contenthash].js',
  },
  optimization: {
    // moduleIds: 'deterministic',
    // https://webpack.js.org/configuration/optimization/#optimizationruntimechunk
    // 指定是否将Webpack的运行时（每个文件中重复的、用于加载的函数）拆分为独立文件，能减少重复代码。
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: MAX_REQUEST_NUM,
      maxAsyncRequests: MAX_REQUEST_NUM,
      cacheGroups: {
        defaultVendors: false,
        default: false,
        lib: {
          chunks: 'all',
          test(module) {
            return (
              module.size() > MIN_LIB_CHUNK_SIZE &&
              /node_modules[/\\]/.test(module.identifier())
            );
          },
          name(module) {
            const hash = crypto.createHash('sha1');
            if (isModuleCSS(module)) {
              module.updateHash(hash);
            } else {
              if (!module.libIdent) {
                throw new Error(
                  `Encountered unknown module type: ${module.type}. Please check webpack/prod.client.config.js.`,
                );
              }
              hash.update(
                module.libIdent({ context: path.join(__dirname, '../') }),
              );
            }

            return `lib_${hash.digest('hex').substring(0, 8)}`;
          },
          priority: 3,
          minChunks: 1,
          reuseExistingChunk: true,
        },
        shared: {
          chunks: 'all',
          minSize: MIN_LIB_CHUNK_SIZE,
          name(module, chunks) {
            return `shared_${crypto
              .createHash('sha1')
              .update(
                chunks.reduce((acc, chunk) => {
                  return acc + chunk.name;
                }, ''),
              )
              .digest('hex')}${isModuleCSS(module) ? '_CSS' : ''}`;
          },
          priority: 1,
          minChunks: 2,
          reuseExistingChunk: true,
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
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,

          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[local]-[hash:base64:10]',
              },
            },
          },
          'postcss-loader',
        ],
        include: /\.module\.css$/,
      },
    ],
  },
};
