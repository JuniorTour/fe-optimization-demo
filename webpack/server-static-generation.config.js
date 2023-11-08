const { merge } = require('webpack-merge');
const path = require('path');
const serverConfig = require('./server.config');

module.exports = merge(serverConfig, {
  entry: path.resolve(__dirname, '../server/staticGenerator.tsx'),
  output: {
    filename: 'staticGenerator.js',
  },
});
