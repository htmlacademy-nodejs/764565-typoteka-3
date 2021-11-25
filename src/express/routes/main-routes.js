'use strict';

const {Router} = require(`express`);
const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);
const {checkAdminRole} = require(`../../utils`);
const {prepareErrors} = require(`../../utils`);
const api = require(`../api`).getAPI();

const ARTICLES_PER_PAGE = 8;
const ARTICLES_MOST_POPULAR = 4;
const LAST_COMMENTS = 4;

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const limitPopular = ARTICLES_MOST_POPULAR;
  const limitLastComments = LAST_COMMENTS;

  const isAdminUser = checkAdminRole(user);

  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [
    {articles, lastComments},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset, needComments: true, limitPopular, limitLastComments}),
    api.getCategories({withCount: true})
  ]);

  const totalPages = Math.ceil(articles.all.count / ARTICLES_PER_PAGE);

  res.render(`main`, {articles, lastComments, page, totalPages, categories, user, isAdminUser});
});

mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;
  res.render(`sign-up`, {user});
});

mainRouter.post(`/register`, upload.single(`upload`), async (req, res) => {
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
  const {query} = req.query;

  try {
    const result = await api.search({query});
    res.render(`search`, {
      query,
      result,
      user
    });
  } catch (error) {
    res.render(`search`, {
      query,
      result: [],
      user
    });
  }
});

mainRouter.get(`/categories`, auth, async (req, res) => {
  const {user} = req.session;
  const isAdminUser = checkAdminRole(user);

  const categories = await api.getCategories({withCount: false});
  res.render(`all-categories`, {categories, user, isAdminUser});
});

mainRouter.post(`/categories/:id`, auth, async (req, res) => {
  const {user} = req.session;
  const {body} = req;
  const {id} = req.params;

  const categoryData = {
    name: body[`category-${id}`],
    userId: user.id
  };

  try {
    if (req.body.save) {
      await api.editCategory(id, categoryData);
    } else if (req.body.delete) {
      await api.removeCategory(id);
    }
    res.redirect(`/categories`);
  } catch (errors) {
    const isAdminUser = checkAdminRole(user);
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories({withCount: false});
    res.render(`all-categories`, {categories, user, isAdminUser, validationMessages});
  }
});

mainRouter.post(`/categories`, auth, async (req, res) => {
  const {user} = req.session;
  const {body} = req;
  const categoryData = {
    name: body[`add-category`],
    userId: user.id
  };
  try {
    await api.createCategory(categoryData);
    res.redirect(`/categories`);
  } catch (errors) {
    const isAdminUser = checkAdminRole(user);
    const validationMessages = prepareErrors(errors);
    const categories = await api.getCategories({withCount: false});
    res.render(`all-categories`, {categories, user, isAdminUser, validationMessages});
  }
});

module.exports = mainRouter;
