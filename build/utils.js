const HtmlWebpackPlugin = require('html-webpack-plugin');
const pagesConfig       = require('./config').pages;
const configDev         = {
  cache: true,
  hash: false,
  inject: true,
  chunksSortMode: 'dependency'
};
const configProd        = {
  cache: true,
  hash: false,
  inject: true,
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true
  },
  chunksSortMode: 'dependency'
};

/**
 * 入口配置
 * @returns {{}}
 */
function getEntryConfig() {
  const res = {};
  pagesConfig.forEach(name => res[name] = `./examples/${name}/index.js`);
  return res;
}

/**
 * 页面配置
 * @param isDev
 * @returns {Array}
 */
function getHtmlPluginConfig({isDev = false}) {
  const htmlConf = isDev ? configDev : configProd;
  return pagesConfig.map(name => {
    return new HtmlWebpackPlugin(Object.assign(htmlConf, {
      filename: `${name}.html`,
      template: `examples/${name}/index.html`,
      chunks: [`${name}`]
    }))
  })
}

module.exports = {
  getEntryConfig,
  getHtmlPluginConfig,
};