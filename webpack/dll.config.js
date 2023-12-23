const { DllPlugin } = require('webpack');
const { DIST_DLL, reactRuntimeName } = require('./constants');

module.exports = {
  mode: 'production',
  entry: {
    [reactRuntimeName]: ['react', 'react-dom', 'react-router'],
  },
  output: {
    path: DIST_DLL,
    filename: '[name].dll.js',
    library: '[name]_[fullhash]',
  },
  plugins: [
    new DllPlugin({
      path: `${DIST_DLL}/[name]-manifest.json`,
      name: '[name]_[fullhash]',
    }),
  ],
};
