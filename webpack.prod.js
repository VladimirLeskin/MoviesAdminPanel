const {merge} = require('webpack-merge');
const common = require('./webpack.common');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const staticFilePath = 'static';
const hashType = '[contenthash:8]';

const resolvePublicPath = () => {
  const configured = process.env.PUBLIC_PATH;
  if (!configured) {
    return '/admin/';
  }
  return configured.endsWith('/') ? configured : `${configured}/`;
};

module.exports = merge(common, {
  mode: 'production',
  output: {
    clean: true,
    publicPath: resolvePublicPath(),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: {name: 'runtime'},
  },
  module: {
    rules: [
      {
        test: /\.s?[ac]ss$/i, // css/sass/scss
        use: [
          MiniCssExtractPlugin.loader,
          require.resolve('css-loader'), // Translates CSS into CommonJS
          require.resolve('sass-loader'), // Compiles Sass to CSS
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${staticFilePath}/css/[name].${hashType}.css`,
    }),
  ],
});
