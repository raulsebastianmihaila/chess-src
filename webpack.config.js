'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const DefinePlugin = webpack.DefinePlugin;
const mode = process.env.NODE_ENV;
const isProductionTest = false;
const isProduction = mode === 'production' && !isProductionTest;
const basePath = 'chess';

module.exports = {
  mode,
  devtool: 'source-map',
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: isProduction ? `/${basePath}/` : '/',
    filename: '[name].bundle-[hash].js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunksSortMode: 'none',
      template: './src/index.html',
      favicon: './src/img/favicon.ico',
      assetsPrefix: isProduction ? `/${basePath}` : ''
    }),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        basePath: JSON.stringify(isProduction ? basePath : null)
      }
    }),
    new CleanWebpackPlugin(),
    ...isProduction || isProductionTest
      ? [
        new CopyWebpackPlugin([
          {from: 'src/css', to: 'css'}
        ])
      ]
      : []
  ],
  devServer: {
    contentBase: 'src',
    port: 5556,
    historyApiFallback: {
      index: '/'
    }
  }
};
