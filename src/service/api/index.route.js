'use strict';

const {Router} = require(`express`);
const category = require(`./category/category.route`);
const article = require(`./article/article.route`);
const search = require(`./search/search.route`);

const getMockData = require(`../lib/get-mock-data`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
} = require(`./index.service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  article(app, new ArticleService(mockData), new CommentService());
})();

module.exports = app;
