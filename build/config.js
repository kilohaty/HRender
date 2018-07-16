/**
 * ================================
 *             配置文件
 * ================================
 */
module.exports = {
  /**
   * 页面列表
   * -- 入口文件目录
   * ---- JS: examples/example/index.js
   * ---- HTML: examples/example/index.html
   */
  pages: [
    'index'
  ],

  /**
   * 开发配置
   */
  dev: {
    protocol: 'http:',
    hostname: 'localhost',
    port: 3003,
    autoOpenBrowser: true,
    proxyTable: {
    },
  },
};