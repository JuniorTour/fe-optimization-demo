const { resolve } = require('path');

exports.SRC = resolve(__dirname, '../src');
exports.DIST = resolve(__dirname, '../dist');
exports.DIST_DLL = resolve(__dirname, '../dist-dll');
exports.FAVICON = resolve(__dirname, '../public', 'favicon.png');

exports.reactRuntimeName = 'reactRuntime';
