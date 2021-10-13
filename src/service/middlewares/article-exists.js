'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => (req, res, next) => {
  const {articleId} = req.params;
  const article = service.findOne(articleId);

  if (article) {
    res.locals.article = article;
    return next();
  } else {
    return res.status(HttpCode.NOT_FOUND)
      .send(`Article with ${articleId} not found`);
  }
};
