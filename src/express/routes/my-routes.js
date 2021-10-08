'use strict';

const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (req, res) => res.send(`/articles/category/:id`));
myRouter.get(`/comments`, (req, res) => res.send(`/articles/add`));

module.exports = myRouter;
