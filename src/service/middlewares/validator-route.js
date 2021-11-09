'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (joiSchema) => (req, res, next) => {
  const params = req.params;
  const {error} = joiSchema.validate(params);

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }
  return next();
};
