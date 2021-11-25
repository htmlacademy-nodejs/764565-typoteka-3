'use strict';

const {Router} = require(`express`);
const validatorDate = require(`../../middlewares/validator-data`);
const categoryCreateValidator = require(`./validators/category-create.validator`);
const categoryEditValidator = require(`./validators/category-create.validator`);
const categoryUses = require(`./validators/category-uses`);
const {HttpCode} = require(`../../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {withCount} = req.query;
    const categories = await service.findAll(withCount);
    res.status(HttpCode.OK)
      .json(categories);
  });

  route.post(`/`, validatorDate(categoryCreateValidator), async (req, res) => {
    const category = await service.create(req.body);
    return res.status(HttpCode.CREATED)
      .json(category);
  });

  route.get(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const {limit, offset, needComments} = req.query;
    const category = await service.findOne(categoryId);
    const {count, articlesByCategory} = await service.findPage(categoryId, limit, offset, needComments);
    res.status(HttpCode.OK)
      .json({
        category,
        count,
        articlesByCategory
      });
  });

  route.put(`/:categoryId`, validatorDate(categoryEditValidator), async (req, res) => {
    const {categoryId} = req.params;
    const existCategory = await service.findOne(categoryId);
    if (existCategory) {
      const updatedCategory = await service.update(categoryId, req.body);
      return res.status(HttpCode.OK)
        .json(updatedCategory);
    } else {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${categoryId}`);
    }
  });

  route.delete(`/:categoryId`, categoryUses(service), async (req, res) => {
    const {categoryId} = req.params;
    const deleted = await service.drop(categoryId);
    if (deleted) {
      return res.status(HttpCode.OK)
        .json(deleted);
    } else {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found`);
    }
  });
};
