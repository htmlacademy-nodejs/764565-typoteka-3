'use strict';

const {HttpCode} = require(`../../../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {categoryId} = req.params;
  const {count} = await service.findPage(categoryId);

  if (count === 0) {
    return next();
  }
  return res.status(HttpCode.FORBIDDEN)
    .send(`Category with Id=${categoryId} uses in ${count} articles`);
};
