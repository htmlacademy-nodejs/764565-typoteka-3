'use strict';

const {Model} = require(`sequelize`);
const defineCategory = require(`./category/category.model`);
const defineComment = require(`./article/comment.model`);
const defineArticle = require(`./article/article.model`);
const Aliase = require(`./models.aliase`);

class ArticleCategory extends Model {

}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);

  Article.hasMany(Comment, {as: `comments`, foreignKey: `articleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {foreignKey: `articleId`});

  ArticleCategory.init({}, {
    sequelize,
    modelName: `ArticleCategory`,
    tableName: `article_categories`
  });

  Article.belongsToMany(Category, {through: ArticleCategory, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticleCategory, as: Aliase.ARTICLES});
  Category.hasMany(ArticleCategory, {as: Aliase.ARTICLE_CATEGORIES});

  return {Category, Comment, Article, ArticleCategory};
};

module.exports = define;
