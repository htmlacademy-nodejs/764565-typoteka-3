'use strict';

const {Router} = require(`express`);

const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);
const csrf = require(`csurf`);
const {ensureArray, prepareErrors} = require(`../../utils`);
const {HttpCode} = require(`../../constants`);

const ARTICLES_PER_PAGE = 8;

const api = require(`../api`).getAPI();
const articlesRouter = new Router();

const csrfProtection = csrf();

const getAddArticleData = () => {
  return api.getCategories({withCount: false});
};

const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId),
    api.getCategories({withCount: false})
  ]);
  return [article, categories];
};

const getViewArticleData = async (articleId) => {
  const [
    article,
    categories
  ] = await Promise.all([
    api.getArticle(articleId, {needComments: true}),
    api.getCategories(true)
  ]);

  let articleCategories = categories.filter((item) => {
    return article.categories.find((kitem) => {
      return kitem.id === item.id;
    });
  });

  return [article, articleCategories];
};

articlesRouter.get(`/categories/:categoryId`, async (req, res) => {
  const {user} = req.session;
  const {categoryId} = req.params;

  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [categories, {category, count, articlesByCategory}] = await Promise.all([
    api.getCategories({withCount: true}),
    api.getCategory({categoryId, limit, offset, needComments: true})
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  const articles = {
    category,
    current: articlesByCategory
  };

  res.render(`articles-by-category`, {
    categories,
    count,
    articles,
    page,
    totalPages,
    user
  });
});

articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const categories = await getAddArticleData();
  res.render(`articles/post-new`, {categories, user, csrfToken: req.csrfToken()});
});


articlesRouter.post(`/add`, auth, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const articleData = {
    picture: file ? file.filename : ``,
    title: body.title,
    categories: ensureArray(body.category).map((item) => parseInt(item, 10)),
    announce: body.announcement,
    description: body.fulltext,
    userId: user.id
  };
  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await getAddArticleData();
    res.render(`articles/post-new`, {categories, user, validationMessages, csrfToken: req.csrfToken()});
  }
});

articlesRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const [article, categories] = await getEditArticleData(id);
  console.log(article);
  res.render(`articles/post`, {id, article, categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/edit/:id`, auth, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const {id} = req.params;

  const articleData = {
    picture: file ? file.filename : ``,
    description: body.fulltext,
    announce: body.announcement,
    title: body.title,
    categories: ensureArray(body.category).map((item) => parseInt(item, 10)),
    userId: user.id
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await getEditArticleData(id);
    res.render(`articles/post`, {id, article, categories, user, validationMessages, csrfToken: req.csrfToken()});
  }
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const [article, articleCategories] = await getViewArticleData(id);

  res.render(`articles/post-detail`, {article, id, articleCategories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/:id/comments`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {message} = req.body;
  try {
    await api.createComment(id, {userId: user.id, text: message});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, articleCategories] = await getViewArticleData(id);

    res.render(`articles/post-detail`, {article, id, articleCategories, user, validationMessages, csrfToken: req.csrfToken()});
  }
});

articlesRouter.get(`/:id/comments/:commentId`, auth, async (req, res) => {
  const {user} = req.session;
  const {id, commentId} = req.params;

  try {
    await api.removeComment({id, userId: user.id, commentId});
    res.status(HttpCode.OK);
    res.redirect(`/my/comments`);
  } catch (errors) {
    res.status(errors.response.status).send(errors.response.statusText);
  }
});

module.exports = articlesRouter;
