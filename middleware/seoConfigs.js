const compression = require('compression');
const cookieParser = require('cookie-parser');
const httpsRedirect = require('express-https-redirect');
const expressSitemapXml = require('express-sitemap-xml');
const robots = require('robots.txt');

module.exports = function config(app) {
  /** compression */
  app.use(compression());
  /** cookie parser */
  app.use(cookieParser());
  /**redirect https */
  app.use('/', httpsRedirect());
  /**www to non www */
  app.use(require('express-naked-redirect')(true));
  /**Robots config */
  app.use(robots(__dirname + './../robots.txt'));
  /**Sitemap */
  /**sitemaps config */
  app.use(expressSitemapXml(getUrls, 'https://www.exemplo.com.br'));
  async function getUrls () {
    return await getUrlsFromDatabase();
  };
}