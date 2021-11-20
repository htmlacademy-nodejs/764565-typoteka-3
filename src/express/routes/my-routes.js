'use strict';

const auth = require(`../middlewares/auth`);
const {Router} = require(`express`);
const {checkAdminRole} = require(`../../utils`);

const myRouter = new Router();

const api = require(`../api`).getAPI();

myRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const {articles} = await api.getArticles();
  const isAdminUser = checkAdminRole(user);
  res.render(`my-article`, {articles, user, isAdminUser});
});

myRouter.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const {articles} = await api.getArticles({needComments: true});
  const isAdminUser = checkAdminRole(user);
  res.render(`comments`, {articles, user, isAdminUser});
});

module.exports = myRouter;
