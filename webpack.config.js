'use strict';

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? 'chess' : null;

module.exports = {
  entry: {
    main: `${__dirname}/src/js/main.js`
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [`${__dirname}/src`, 'node_modules']
  },
  devtool: 'source-map',
  output: {
    path: `${__dirname}/dist/assets`,
    filename: 'js/[name].[chunkhash].js',
    publicPath: isProduction ? `/${basePath}/assets` : '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        // normalization needed for windows
        include: path.normalize(`${__dirname}/src`),
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['transform-es2015-modules-commonjs']
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              failOnError: isProduction,
              emitWarning: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        basePath: JSON.stringify(isProduction ? basePath : null)
      }
    }),
    new CleanWebpackPlugin(['dist']),
    new CopyWebpackPlugin([
      {from: 'src/assets/css', to: 'css'}
    ]),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: isProduction ? '../index.html' : './index.html',
      favicon: `${__dirname}/src/assets/img/favicon.ico`,
      assetsPrefix: isProduction ? `/${basePath}` : ''
    })
  ],
  devServer: {
    contentBase: 'src',
    inline: true,
    port: 6543,
    historyApiFallback: {
      index: '/'
    }
  }
};

if (isProduction) {
  module.exports.plugins.push(new UglifyJsPlugin({
    uglifyOptions: {compress: {warnings: false}},
    sourceMap: true
  }));
}
