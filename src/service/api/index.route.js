'use strict';

const {Router} = require(`express`);
const category = require(`./category/category.route`);
const article = require(`./article/article.route`);
const search = require(`./search/search.route`);
const user = require(`./user/user.route`);

const sequelize = require(`./sequelize`);
const defineModels = require(`./index.model`);

const CategoryService = require(`./category/category.service`);
const SearchService = require(`./search/search.service`);
const ArticleService = require(`./article/article.service`);
const CommentService = require(`./article/comment.service`);
const UserService = require(`./user/user.service`);

const app = new Router();

defineModels(sequelize);

(() => {
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  article(app, new ArticleService(sequelize), new CommentService(sequelize));
  user(app, new UserService(sequelize));
})();

module.exports = app;
