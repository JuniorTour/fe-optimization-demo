const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { SRC, FAVICON } = require('./constants');

const configPlugins = [
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    defaultSizes: 'gzip',
    openAnalyzer: false,
  }),
  new FaviconsWebpackPlugin({
    logo: FAVICON,
  }),
];

if (!process.env.BUILD_SERVER) {
  configPlugins.push(
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body',
    }),
  );
}

module.exports = {
  context: SRC,
  entry: ['react-hot-loader/patch', './index.tsx'],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    // alias: {
    //   'react-dom': '@hot-loader/react-dom',
    // },
  },
  plugins: configPlugins,
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
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
