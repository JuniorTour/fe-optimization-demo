module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/typescript',
    [
      '@babel/preset-react',
      { runtime: 'automatic', importSource: '@emotion/react' },
    ],
  ],
  plugins: [
    '@emotion/babel-plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          'react-dom': '@hot-loader/react-dom',
          '@': './src',
        },
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
      },
    ],
  ],
  env: {
    test: {
      plugins: [
        'react-hot-loader/babel',
        'effector/babel-plugin',
        [
          '@babel/transform-runtime',
          {
            regenerator: true,
          },
        ],
      ],
    },
  },
};
