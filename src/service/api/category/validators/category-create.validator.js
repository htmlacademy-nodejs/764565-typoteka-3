'use strict';

const Joi = require(`joi`);

const ErrorCategoryMessage = {
  NAME_MIN: `Название категории содержит меньше 5 символов`,
  NAME_MAX: `Название категории содержит больше 30 символов`,
  USER_ID: `Некорректный идентификатор пользователя`
};

module.exports = Joi.object({
  name: Joi.string().min(5).max(30).required().messages({
    'string.min': ErrorCategoryMessage.NAME_MIN,
    'string.max': ErrorCategoryMessage.NAME_MAX
  }),
  userId: Joi.number().integer().positive().required().messages({
    'number.base': ErrorCategoryMessage.USER_ID
  })
});
