const webpack = require( 'webpack' );

const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

const ENV = ( process.env.NODE_ENV || 'development' );

const webpackConfigEntryPoints = {
  app: './app/bootstrap.ts'
};

const webpackConfigLoaders = [

  // Scripts
  {
    test: /\.ts$/,
    exclude: [ /node_modules/ ],
    loader: 'ts-loader'
  },

  // Styles
  {
    test: /\.css$/,
    loaders: [ 'style-loader', 'css-loader' ]
  },

  // Fonts
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'url-loader?limit=10000&minetype=application/font-woff'
  },
  {
    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader'
  },

  //HTML
  {
    test: /\.html$/,
    loader: 'raw-loader'
  }

];

const webpackConfigPlugins = [

  new HtmlWebpackPlugin({
    template: 'app/index.html',
    inject: 'body',
    hash: true,
    env: ENV,
    host: '0.0.0.0',
    port: process.env.npm_package_config_port
  }),

  new CopyWebpackPlugin([
    {
      from: 'app/assets',
      to: './'
    }
  ])

];


module.exports = {
  devtool: 'source-map',
  entry: webpackConfigEntryPoints,
  output: {
    path: '/',
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    // Add `.ts` as a resolvable extension.
    extensions: [ '', '.webpack.js', '.web.js', '.ts', '.js' ]
  },
  watch: true,
  module: {
    loaders: webpackConfigLoaders
  },
  plugins: webpackConfigPlugins
};
