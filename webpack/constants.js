const { resolve } = require('path');

exports.SRC = resolve(__dirname, '../src');
exports.FAVICON = resolve(__dirname, '../public', 'favicon.png');
exports.DIST = resolve(__dirname, '../dist/client');
exports.PUBLIC_PATH = '/static';
