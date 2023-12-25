const { resolve } = require('path');

exports.SRC = resolve(__dirname, '../src');
exports.DIST = resolve(__dirname, '../dist');
exports.FAVICON = resolve(__dirname, '../public', 'favicon.png');

const IS_DEVELOPMENT =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
// console.log(`IS_DEVELOPMENT=${IS_DEVELOPMENT}`);

exports.IS_DEVELOPMENT = IS_DEVELOPMENT;
