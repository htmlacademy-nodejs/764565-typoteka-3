'use strict';

const {Op} = require(`sequelize`);
const Aliase = require(`../models.aliase`);
const ArticleModel = require(`./../article/article.model`);

class SearchService {
  constructor() {
    this._Article = ArticleModel;
  }

  async findAll(searchText) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      },
      include: [Aliase.CATEGORIES],
      order: [
        [`createdAt`, `DESC`]
      ]
    });
    return articles.map((article) => article.get());
  }
}

module.exports = SearchService;
