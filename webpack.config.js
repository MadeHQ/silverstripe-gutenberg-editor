const Path = require('path');
// const webpack = require('webpack');
// const webpackConfig = require('@silverstripe/webpack-config');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const {
//   resolveJS,
//   externalJS,
//   moduleJS,
//   pluginJS,
//   moduleCSS,
//   pluginCSS,
// } = webpackConfig;

const ENV = process.env.NODE_ENV;
const PATHS = {
  MODULES: 'node_modules',
  THIRDPARTY: 'thirdparty',
  FILES_PATH: '../',
  ROOT: Path.resolve(),
  SRC: Path.resolve('client/src'),
  DIST: Path.resolve('client/dist'),
};

const config = [
  {
    name: 'js',
    entry: {
      app: `${PATHS.SRC}/js/app.js`
    },
    output: {
      path: PATHS.DIST,
      filename: 'js/[name].js',
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            cacheDirectory: true,
            presets: ['react', 'es2015']
          }
        }
      ]
    },
    devtool: (ENV !== 'production') ? 'source-map' : '',
    // resolve: resolveJS(ENV, PATHS),
    // externals: externalJS(ENV, PATHS),
    // module: moduleJS(ENV, PATHS),
    devServer: {
      contentBase: "./public"
    }
  },
];

module.exports = (process.env.WEBPACK_CHILD)
  ? config.find((entry) => entry.name === process.env.WEBPACK_CHILD)
  : module.exports = config;
