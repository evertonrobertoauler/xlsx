var webpack = require('webpack');

var defineObj = {
  ON_DEVELOPMENT: process.env.NODE_ENV === 'development',
  ON_PRODUCTION: process.env.NODE_ENV === 'production'
};

var plugins = [
  new webpack.NoErrorsPlugin()
];

if (defineObj.ON_PRODUCTION) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true, compress: {warnings: false}}));
}

module.exports = {
  context: __dirname + '/app/src',
  entry: {
    'xlsx': './index.js',
    'xlsx.webworker': './webworker.js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  output: {
    path: __dirname + '/app/dist',
    filename: defineObj.ON_PRODUCTION ? '[name].min.js' : '[name].js',
    library: 'xlsx',
    libraryTarget: 'umd'
  },
  debug: !defineObj.ON_PRODUCTION,
  devtool: '#source-maps',
  watchOptions: {
    aggregateTimeout: 200
  },
  plugins: plugins
};
