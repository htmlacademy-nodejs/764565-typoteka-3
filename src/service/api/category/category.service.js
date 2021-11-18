'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models.aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async create(category) {
    console.log(`----111111111111111111111111111111`);
    console.log(category);
    return this._Category.create(category);
  }

  async update(id, category) {
    const [affectedRows] = await this._Category.update(category, {
      where: {id}
    });
    return !!affectedRows;
  }

  async findAll(needCount) {
    console.log(typeof needCount);
    if (needCount) {
      console.log(`TRUUUUE`);
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(
                `COUNT`,
                Sequelize.col(`CategoryId`)
            ),
            `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORIES,
          attributes: [],
          where: {
          }
        }]
      });
      return result.map((it) => it.get());
    } else {
      console.log(`FAAAALSE`);
      return this._Category.findAll({raw: true});
    }
  }

  async findOne(categoryId) {
    return this._Category.findByPk(categoryId);
  }

  async findPage(categoryId, limit, offset, needComments) {
    const include = [
      Aliase.CATEGORIES
    ];

    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
      });
    }

    const articlesIdByCategory = await this._ArticleCategory.findAll({
      attributes: [`ArticleId`],
      where: {
        CategoryId: categoryId
      },
      raw: true
    });

    const articlesId = articlesIdByCategory.map((articleIdItem) => articleIdItem.ArticleId);

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      order: [
        [`createdAt`, `DESC`]
      ],
      where: {
        id: articlesId
      },
      distinct: true
    });

    return {count, articlesByCategory: rows};
  }
}

module.exports = CategoryService;
