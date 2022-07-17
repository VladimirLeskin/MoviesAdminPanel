const {merge} = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common');
const path = require('path');

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    require.resolve('style-loader'),
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
  ];

  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: true,
      },
    });
  }
  return loaders;
};

/** @type {import('webpack').Configuration} */
const config = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        use: getStyleLoaders({importLoaders: 1, sourceMap: true}),
      },
      {
        test: cssModuleRegex,
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: true,
        }),
      },
      {
        test: sassRegex,
        exclude: sassModuleRegex,
        use: getStyleLoaders({sourceMap: true, importLoaders: 3}, 'sass-loader'),
      },
      {
        test: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 3,
            sourceMap: true,
          },
          'sass-loader'
        ),
      },
    ],
  },
  devServer: {
    compress: false,
    port: 8087,
    open: true,
    hot: true,
    proxy: {
      '/movies-api': {
        target: process.env.API_HOST,
        secure: false,
        changeOrigin: true,
      },
      '/web': {
        target: process.env.API_HOST,
        secure: false,
        changeOrigin: true,
      },
      '/images': {
        target: process.env.IMG_PATH,
        secure: true,
        changeOrigin: true,
      },
    },
    historyApiFallback: {
      disableDotRule: true,
    },
  },
});

module.exports = config;
