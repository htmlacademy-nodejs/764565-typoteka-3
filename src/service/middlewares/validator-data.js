'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (joiSchema) => (req, res, next) => {
  const date = req.body;
  const {error} = joiSchema.validate(date, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
