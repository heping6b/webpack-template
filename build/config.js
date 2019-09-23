'use strict';

// "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",
// "start": "npm run dev",
// "unit": "cross-env BABEL_ENV=test karma start test/unit/karma.conf.js --single-run",
// "test": "npm run unit",
// "lint": "eslint --ext .js,.vue src test/unit",
// "build": "node build/build.js"

const path = require('path');

module.exports = {
  dev: {
    NODE_ENV: '"development"',

    // 静态资源文件夹
    assetsSubDirectory: 'assets',

    // https://www.webpackjs.com/configuration/output/#output-publicpath
    // 静态资源路径前缀，尽量别使用绝对路径，不然会怀疑人生
    assetsPublicPath: './',

    // https://www.webpackjs.com/configuration/dev-server/#devserver-proxy
    proxy: {},

    // 指定使用一个 host。默认是 localhost
    host: '127.0.0.1',

    // 指定要监听请求的端口号
    port: 8081,

    // 自动打开浏览器
    autoOpenBrowser: true,

    // 当存在编译器错误或警告时，在浏览器中显示全屏覆盖。默认情况下禁用。如果只想显示编译器错误
    errorOverlay: true,

    // 是否启用错误通知
    notifyOnErrors: true,

    // https://www.webpackjs.com/configuration/watch/#watchoptions-poll
    // 通过传递 true 开启 polling，或者指定毫秒为单位进行轮询
    poll: false,

    // https://www.webpackjs.com/configuration/devtool/#devtool
    devtool: 'cheap-module-eval-source-map',

    // 是否启用语法检查
    useEslint: true,

    // 如果为 true，则eslint错误和警告也将显示在错误覆盖中
    showEslintErrorsInOverlay: false,

    cssSourceMap: false
  },

  build: {
    NODE_ENV: '"production"',
    // html 模板
    index: path.resolve(__dirname, '../src/index.html'),

    // 出口文件夹
    assetsRoot: path.resolve(__dirname, '../dist'),

    // 静态资源文件夹
    assetsSubDirectory: 'assets',

    // https://www.webpackjs.com/configuration/output/#output-publicpath
    // 静态资源路径前缀，尽量别使用绝对路径，不然会怀疑人生
    assetsPublicPath: './',

    // source map
    sourceMap: false,

    // https://www.webpackjs.com/configuration/devtool/#devtool
    // sourceMap 为true时启用
    devtool: '#source-map',

    // https://webpack.js.org/plugins/compression-webpack-plugin/
    // 是否启用静态资源压缩
    gzip: false,

    // gzip 为true时启用
    // 需压缩的静态资源的扩展名
    gzipExtensions: ['js', 'css'],

    // 运行build命令，附加一个参数to
    // 构建完成后查看bundle analyzer报告: npm运行构建 - 报告
    // 设置为 true 或 false ，打开或关闭
    // bundleAnalyzerReport: process.env.npm_config_report
    bundleAnalyzerReport: true
  }
};