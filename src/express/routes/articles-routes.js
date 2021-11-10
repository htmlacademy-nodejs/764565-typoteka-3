'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();
const upload = require(`../middlewares/upload`);
const {ensureArray, prepareErrors} = require(`../../utils`);

const api = require(`../api`).getAPI();

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

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await getAddArticleData();
  res.render(`articles/post-new`, {categories});
});


articlesRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const articleData = {
    picture: file ? file.filename : ``,
    title: body.title,
    category: ensureArray(body.category),
    announce: body.announce,
    fullText: body.fullText
  };
  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await getAddArticleData();
    res.render(`articles/post-new`, {categories, validationMessages});
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await getEditArticleData(id);

  res.render(`articles/post`, {id, article, categories});
});

articlesRouter.post(`/edit/:id`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;

  const articleData = {
    picture: file ? file.filename : ``,
    description: body.fulltext,
    announce: body.announcement,
    title: body.title,
    category: ensureArray(body.category)
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await getEditArticleData(id);
    res.render(`articles/post`, {id, article, categories, validationMessages});
  }
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, articleCategories] = await getViewArticleData(id);

  res.render(`articles/post-detail`, {article, id, articleCategories});
});

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {message} = req.body;
  try {
    await api.createComment(id, {text: message});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, articleCategories] = await getViewArticleData(id);

    res.render(`articles/post-detail`, {article, id, articleCategories, validationMessages});
  }
});

module.exports = articlesRouter;
