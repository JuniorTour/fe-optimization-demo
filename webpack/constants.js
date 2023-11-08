const { resolve } = require('path');

exports.SRC = resolve(__dirname, '../src');
exports.FAVICON = resolve(__dirname, '../public', 'favicon.png');
exports.DIST_CLIENT = resolve(__dirname, '../dist/client');
exports.DIST = resolve(__dirname, '../dist');
exports.PUBLIC_PATH = '/static';
