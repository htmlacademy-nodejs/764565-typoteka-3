'use strict';

const {Router} = require(`express`);
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);

const mainRouter = new Router();

const api = require(`../api`).getAPI();

const ARTICLES_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;

  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset, needComments: true}),
    api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  res.render(`main`, {articles, page, totalPages, categories});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file ? file.filename : ``,
    firstName: body.name,
    lastName: body.surname,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`]
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`sign-up`, {validationMessages});
  }
});

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
