'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
    filename: '[name].bundle-[contenthash].js',
    clean: true
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        include: /(crizmas-|smart-mix)/,
        sideEffects: false
      }
    ]
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
    ...isProduction || isProductionTest
      ? [
        new CopyWebpackPlugin({
          patterns: [
            {from: 'src/css', to: 'css'}
          ]
        })
      ]
      : []
  ],
  devServer: {
    port: 5556,
    static: {
      directory: 'src'
    },
    historyApiFallback: {
      index: '/'
    }
  }
};
