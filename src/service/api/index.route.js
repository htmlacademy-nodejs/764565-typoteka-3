'use strict';

const {Router} = require(`express`);
const category = require(`./category/category.route`);
const article = require(`./article/article.route`);
const search = require(`./search/search.route`);

const sequelize = require(`../../service/sequelize`);
const defineModels = require(`./index.model`);

const CategoryService = require(`./category/category.service`);
const SearchService = require(`./search/search.service`);
const ArticleService = require(`./article/article.service`);
const CommentService = require(`./article/comment.service`);

const app = new Router();

defineModels();

(() => {
  category(app, new CategoryService());
  search(app, new SearchService());
  article(app, new ArticleService(), new CommentService());
})();

module.exports = app;
