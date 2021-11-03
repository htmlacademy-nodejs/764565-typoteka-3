'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();

const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [
    articles,
    categories
  ] = await Promise.all([
    api.getArticles({comments: true}),
    api.getCategories(true)
  ]);

  res.render(`main`, {articles, categories});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res) => {
  try {
    const {query} = req.query;
    const results = await api.search(query);

    res.render(`search`, {
      results
    });
  } catch (error) {
    res.render(`search`, {
      results: []
    });
  }
});

mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
