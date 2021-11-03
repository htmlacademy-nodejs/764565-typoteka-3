'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {ensureArray} = require(`../../utils`);

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const api = require(`../api`).getAPI();

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
articlesRouter.get(`/add`, (req, res) => res.render(`articles/post-new`));

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
    await api.createOffer(articleData);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);

  res.render(`articles/post`, {article, categories});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id, true);
  res.render(`articles/post-detail`, {article});
});

module.exports = articlesRouter;
