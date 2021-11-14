'use strict';

const {Router} = require(`express`);

const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);
const csrf = require(`csurf`);
const {ensureArray, prepareErrors} = require(`../../utils`);

const api = require(`../api`).getAPI();
const articlesRouter = new Router();

const csrfProtection = csrf();

const getAddArticleData = () => {
  return api.getCategories();
};

const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId),
    api.getCategories()
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

articlesRouter.get(`/category/:id`, (req, res) => {
  const {user} = req.session;
  res.render(`articles-by-category`, {user});
});

articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const categories = await getAddArticleData();
  res.render(`articles/post-new`, {categories, user, csrfToken: req.csrfToken()});
});


articlesRouter.post(`/add`, auth, upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const articleData = {
    picture: file ? file.filename : ``,
    title: body.title,
    category: ensureArray(body.category),
    announce: body.announce,
    fullText: body.fullText,
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
  res.render(`articles/post`, {id, article, categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/edit/:id`, auth, upload.single(`avatar`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const {id} = req.params;
  const articleData = {
    picture: file ? file.filename : ``,
    description: body.fulltext,
    announce: body.announcement,
    title: body.title,
    category: ensureArray(body.category),
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

module.exports = articlesRouter;
