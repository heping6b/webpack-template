'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CleanWebpackPlugin = require("clean-webpack-plugin"); // 清理工作目录
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css，webpack v4.0 用法
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const utils = require('./utils');
const config = require('./config');
const baseWebpackConfig = require('./webpack.base.conf');

const webpackConfig = merge(baseWebpackConfig, {
  // https://webpack.js.org/plugins/split-chunks-plugin/
  optimization: {
    // 采用splitChunks提取出entry chunk的chunk Group
    splitChunks: {
      cacheGroups: {
        // 处理入口chunk
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name: 'vendors',
        },
        // 处理异步chunk
        'async-vendors': {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 2,
          chunks: 'async',
          name: 'async-vendors'
        }
      }
    },
    // 为每个入口提取出webpack runtime模块
    runtimeChunk: { name: 'manifest' }
  },

  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.sourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.sourceMap
    ? config.build.devtool
    : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash:7].js'),
    chunkFilename: utils.assetsPath('js/[name].[chunkhash:7].js')
  },
  plugins: [
    // https://www.webpackjs.com/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': config.dev.NODE_ENV
    }),

    // new CleanWebpackPlugin(['dist']),

    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash:7].css'),
    }),

    // 压缩css
    new OptimizeCssAssetsPlugin({
      // 官方给“/\.optimize\.css$/g”会导致css压缩失败，改为“/\.css$/g”
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    }),

    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      // 模板路径
      template: utils.resolve('src/index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: false
        // more options: https://github.com/kangax/html-minifier#options-quick-reference
      },
      // dependency 按照不同文件的依赖关系排序
      chunksSortMode: 'dependency'
    }),

    // https://www.webpackjs.com/plugins/hashed-module-ids-plugin/
    // 根据模块的相对路径生成一个四位数的hash作为模块id
    new webpack.HashedModuleIdsPlugin(),

    // https://www.webpackjs.com/plugins/module-concatenation-plugin/
    new webpack.optimize.ModuleConcatenationPlugin(),

    // 将静态资源目录复制到发布的目录
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.gzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig;
