'use strict';

const auth = require(`../middlewares/auth`);
const {Router} = require(`express`);
const myRouter = new Router();

const api = require(`../api`).getAPI();

myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({userId: user.id});
  res.render(`my-article`, {articles, user});
});

myRouter.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const {articles} = await api.getArticles({needComments: true});

  res.render(`comments`, {user, articles});
});

module.exports = myRouter;
