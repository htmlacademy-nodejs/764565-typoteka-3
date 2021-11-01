'use strict';

const ArticleModel = require(`./article.model`);
const CommenModel = require(`./comment.model`);

class CommentService {
  constructor() {
    this._Article = ArticleModel;
    this._Comment = CommenModel;
  }

  create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });
    console.log(deletedRows);
    console.log(!deletedRows);
    console.log(!!deletedRows);
    return !!deletedRows;
  }

  findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }
}

module.exports = CommentService;
