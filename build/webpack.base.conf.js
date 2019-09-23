'use strict';

const path = require('path');

const utils = require('./utils');
const config = require('./config');
const resolve = utils.resolve;

const createLintingRule = () => ({
  test: /\.jsx?$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [
    resolve('src'), resolve('test')
  ],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
});

module.exports = {
  context: path.resolve(__dirname, '../'),
  mode: process.env.NODE_ENV,

  // 运行环境：web环境
  target: 'web',

  // 监听文件，自动打包
  watch: true,
  entry: {
    app: './src/main.js'
  },
  output: {
    //output目录对应一个绝对路径
    path: config.build.assetsRoot,

    // 此选项决定了每个输出 bundle 的名称。这些 bundle 将写入到 output.path 选项指定的目录下
    filename: '[name].js',

    // https://www.webpackjs.com/configuration/output/#output-publicpath
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    // https://www.webpackjs.com/configuration/resolve/#resolve-alias
    alias: {
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      // ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/webpack-dev-server/client')
        ],
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
};