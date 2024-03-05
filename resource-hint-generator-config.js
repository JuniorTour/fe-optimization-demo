module.exports = {
  resourcePath: `./dist`,
  projectRootPath: __dirname,
  resourceHintFileName: `resource-hint.js`,
  includeFileTestFunc: (fileName) => {
    return /(main.*js)|(main.*css)/g.test(fileName);
  },
  crossOriginValue: '',
  publicPath: 'https://github.com/JuniorTour',
  preconnectDomains: ['https://preconnect-example.com'],
};
