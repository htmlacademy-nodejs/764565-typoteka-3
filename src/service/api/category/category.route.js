'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {withCount} = req.query;
    console.log(`-------------------`);
    console.log(JSON.parse(JSON.stringify(req.query)));
    const categories = await service.findAll(withCount);
    res.status(HttpCode.OK)
      .json(categories);
  });

  route.post(`/`, async (req, res) => {
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

  route.put(`/:categoryId`, async (req, res) => {
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
};
