'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);
const editArticleValidator = require(`./validators/article-edit.validator`);
const validatorDate = require(`../../middlewares/validator-data`);
const validatorRoute = require(`../../middlewares/validator-route`);
const articleExist = require(`./validators/article-exists`);
const commentValidator = require(`./validators/comment-create.validator`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, needComments} = req.query;
    let result;
    result = await articleService.findAll({limit, offset, needComments});

    res.status(HttpCode.OK).json(result);
  });

  route.get(`/:articleId`, validatorRoute, async (req, res) => {
    const {articleId} = req.params;
    const {comments} = req.query;

    const article = await articleService.findOne(articleId, comments);
    if (article) {
      return res.status(HttpCode.OK)
        .json(article);
    } else {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found with ${articleId}`);
    }
  });

  route.post(`/`, validatorDate(editArticleValidator), async (req, res) => {
    const article = await articleService.create(req.body);
    return res.status(HttpCode.CREATED)
      .json(article);
  });

  route.put(`/:articleId`, [validatorRoute, validatorDate(editArticleValidator)], async (req, res) => {
    const {articleId} = req.params;
    const existArticle = await articleService.findOne(articleId);

    if (existArticle) {
      const updatedArticle = await articleService.update(articleId, req.body);
      return res.status(HttpCode.OK)
        .json(updatedArticle);
    } else {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }
  });

  route.delete(`/:articleId`, validatorRoute, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);

    if (article) {
      return res.status(HttpCode.OK)
        .json(article);
    } else {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }
  });

  route.get(`/:articleId/comments`, [validatorRoute, articleExist(articleService)], async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentService.findAll(articleId);

    res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, [validatorRoute, articleExist(articleService)], async (req, res) => {
    const {commentId} = req.params;
    const deleted = await commentService.drop(commentId);

    if (deleted) {
      return res.status(HttpCode.OK)
        .json(deleted);
    } else {
      return res.status(HttpCode.NOT_FOUND)
      .send(`Not found`);
    }
  });

  route.post(`/:articleId/comments`, [validatorRoute, articleExist(articleService), validatorDate(commentValidator)], async (req, res) => {
    const {articleId} = req.params;
    const comment = commentService.create(articleId, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });

};
