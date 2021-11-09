'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {ensureArray, prepareErrors} = require(`../../utils`);

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const api = require(`../api`).getAPI();

const getAddArticleData = () => {
  return api.getCategories();
};

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId),
    api.getCategories()
  ]);
  return [article, categories];
};

const getViewArticleData = (articleId, comments) => {
  return api.getArticle(articleId, comments);
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
  const article = await getViewArticleData(id, true);
  res.render(`articles/post-detail`, {article, id});
});

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {message} = req.body;
  try {
    await api.createComment(id, {text: message});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const article = await getViewArticleData(id, true);
    res.render(`articles/post-detail`, {article, id, validationMessages});
  }
});

module.exports = articlesRouter;
