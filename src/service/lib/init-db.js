'use strict';

const defineModels = require(`../api/index.model`);
const Aliase = require(`../api/models.aliase`);
const ArticleModel = require(`./../api/article/article.model`);
const CategoryModel = require(`./../api/category/category.model`);
const sequelize = require(`../sequelize`);
module.exports = async ({categories, articles}) => {
  defineModels();
  await sequelize.getInstance().sync({force: true});

  const categoryModels = await CategoryModel.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});

  const articlePromises = articles.map(async (article) => {
    const articleModel = await ArticleModel.create(article);
    await articleModel.addCategories(
        article.category.map(
            (name) => categoryIdByName[name]
        )
    );
  });

  await Promise.all(articlePromises);
};
