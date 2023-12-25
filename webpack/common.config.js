const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { SRC, FAVICON, IS_DEVELOPMENT } = require('./constants');

const BABEL_LOADER_NAME = `babel-loader`;

const config = {
  context: SRC,
  entry: ['react-hot-loader/patch', './index.tsx'],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    // alias: {
    //   'react-dom': '@hot-loader/react-dom',
    // },
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      defaultSizes: 'gzip',
      openAnalyzer: false,
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body',
    }),
    new FaviconsWebpackPlugin({
      logo: FAVICON,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        use: [BABEL_LOADER_NAME],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        use: ['url-loader'],
      },
    ],
  },
};

if (IS_DEVELOPMENT) {
  config.resolve.plugins = [
    // 解决 esbuild-loader 不支持 tsconfig.json 中自定义路径 path 的问题：
    // 背景信息：https://github.com/esbuild-kit/esbuild-loader/commit/270cda404b9aa76e826499fc90e9783193f146cc
    new TsconfigPathsPlugin(),
  ];

  const compilerIndex = config.module.rules.findIndex(
    (rule) => rule.use?.[0] === BABEL_LOADER_NAME,
  );
  // console.log(`compilerIndex=${compilerIndex}`);

  if (compilerIndex >= 0) {
    config.module.rules[compilerIndex] = {
      test: /\.[jt]sx?$/,
      exclude: /node_modules/,
      loader: 'esbuild-loader',
      options: {
        loader: 'tsx', // 开启对 JSX 的支持
        target: 'es2015', // 设置编译目标为 ES2015 语法
      },
    };
  } else {
    console.error(`Not Found babel-loader, esbuild-loader not work.`);
  }
}

module.exports = config;
