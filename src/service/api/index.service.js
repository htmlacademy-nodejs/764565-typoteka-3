'use strict';

const CategoryService = require(`./category/category.service`);
const SearchService = require(`./search/search.service`);
const ArticleService = require(`./article/article.service`);
const CommentService = require(`./article/comment.service`);

module.exports = {
  CategoryService,
  CommentService,
  SearchService,
  ArticleService,
};
