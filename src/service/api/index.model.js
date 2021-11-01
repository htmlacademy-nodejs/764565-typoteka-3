'use strict';

const {Model} = require(`sequelize`);

const CommentModel = require(`./article/comment.model`);
const ArticleModel = require(`./article/article.model`);
const Aliase = require(`./models.aliase`);
const sequelize = require(`../sequelize`);
const CategoryModel = require(`./category/category.model`);

class ArticleCategory extends Model {

}

ArticleCategory.init({}, {
  sequelize: sequelize.getInstance(),
  modelName: `ArticleCategory`,
  tableName: `article_categories`
});

const define = () => {

  ArticleModel.hasMany(CommentModel);
  CommentModel.belongsTo(ArticleModel);

  ArticleModel.belongsToMany(CategoryModel, {through: ArticleCategory});
  CategoryModel.belongsToMany(ArticleModel, {through: ArticleCategory});

  // CategoryModel.hasMany(ArticleCategory, {as: Aliase.ARTICLE_CATEGORIES});

  return {CategoryModel, CommentModel, ArticleModel, ArticleCategory};
};

module.exports = define;
