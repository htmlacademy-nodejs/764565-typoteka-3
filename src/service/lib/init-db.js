'use strict';

const defineModels = require(`../api/index.model`);
const Aliase = require(`../api/models.aliase`);

module.exports = async (sequelize, {categories, articles}) => {
  const {Category, Article} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Aliase.COMMENTS]});
    await articleModel.addCategories(
        article.category.map(
            (name) => categoryIdByName[name]
        )
    );
  });

  await Promise.all(articlePromises);
};
