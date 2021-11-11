'use strict';

const {Router} = require(`express`);
const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);
const {prepareErrors} = require(`../../utils`);

const mainRouter = new Router();

const api = require(`../api`).getAPI();

const ARTICLES_PER_PAGE = 8;

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
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
  res.render(`main`, {articles, page, totalPages, categories, user});
});

mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;
  res.render(`sign-up`, {user});
});

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {user} = req.session;
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
    res.render(`sign-up`, {user, validationMessages});
  }
});

mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;
  res.render(`login`, {user});
});

mainRouter.post(`/login`, async (req, res) => {
  try {
    const user = await api.auth(req.body.email, req.body.password);
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = req.session;
    res.render(`login`, {user, validationMessages});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;
  try {
    const {query} = req.query;
    const results = await api.search(query);

    res.render(`search`, {
      results,
      user
    });
  } catch (error) {
    res.render(`search`, {
      results: [],
      user
    });
  }
});

mainRouter.get(`/categories`, auth, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
