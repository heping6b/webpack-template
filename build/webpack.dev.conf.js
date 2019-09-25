'use strict';

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const portfinder = require('portfinder');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const utils = require('./utils');
const config = require('./config');
const baseWebpackConfig = require('./webpack.base.conf');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.sourceMap,
      usePostCSS: true
    })
  },
  devtool: config.dev.devtool,

  devServer: {
    clientLogLevel: 'warning',

    // https://www.webpackjs.com/configuration/dev-server/#devserver-historyapifallback
    // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
        },
      ],
    },

    // 启用 webpack 的模块热替换特性
    hot: true,

    // https://www.webpackjs.com/configuration/dev-server/#devserver-contentbase
    contentBase: false,

    // 一切服务都启用gzip 压缩
    compress: false,

    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxy,

    // 启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见
    quiet: true,
    watchOptions: {
      poll: config.dev.poll,
    }
  },

  plugins: [
    // https://www.webpackjs.com/plugins/define-plugin/
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': config.dev.NODE_ENV
    }),

    // 启用热替换模块(Hot Module Replacement)，也被称为 HMR
    new webpack.HotModuleReplacementPlugin(),

    // 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境
    new webpack.NamedModulesPlugin(),

    // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误。对于所有资源，统计资料(stat)的 emitted 标识都是 false
    new webpack.NoEmitOnErrorsPlugin(),

    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      // 模板路径
      template: utils.resolve('src/index.html'),
      inject: true,
      minify: {
        // removeComments: true,
        // collapseWhitespace: true,
        removeAttributeQuotes: false
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      chunks: ['manifest', 'vendors', 'app'],
      chunksSortMode: 'manual'
    }),

    // 将静态资源目录复制到发布的目录
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]

});

// https://github.com/http-party/node-portfinder
module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port;

  portfinder.getPort((err, port) => {
    if (!err) {

      // 最新的发布端口
      process.env.PORT = port

      // 将端口设置到配置文件中
      devWebpackConfig.devServer.port = port

      // https://github.com/geowarin/friendly-errors-webpack-plugin
      // Friendly-errors-webpack-plugin可以识别特定类别的webpack错误，并对它们进行清理、聚合和优先级排序，以提供更好的开发人员体验。
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`
            ]
          },
          onErrors: config.dev.notifyOnErrors
            ? utils.createNotifierCallback()
            : undefined
        })
      );

      resolve(devWebpackConfig);
    } else {
      reject(err);
    }
  });
});
