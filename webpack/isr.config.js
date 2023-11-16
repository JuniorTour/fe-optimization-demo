const path = require('path');
const { merge } = require('webpack-merge');
const serverConfig = require('./server.config');

module.exports = merge(serverConfig, {
  watch: true,
  entry: path.resolve(__dirname, '../server/isr-playground.tsx'),
  output: {
    filename: 'isr-playground.js',
    path: path.resolve(__dirname, '../dist'),
  },
});
