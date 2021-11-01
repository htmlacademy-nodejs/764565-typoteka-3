'use strict';

const Aliase = require(`../models.aliase`);
const ArticleModel = require(`./article.model`);
const CommentModel = require(`./comment.model`);
const CategoryModel = require(`./../category/category.model`);

class ArticleService {
  constructor() {
    this._Article = ArticleModel;
    this._Comment = CommentModel;
    this._Category = CategoryModel;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    return !!affectedRows;
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  findOne(id) {
    return this._Article.findByPk(id, {include: [CategoryModel]});
  }

  async findAll(needComments) {
    const include = [Aliase.CATEGORIES];

    if (needComments) {
      include.push(Aliase.COMMENTS);
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return articles.map((item) => item.get());
  }
}

module.exports = ArticleService;
