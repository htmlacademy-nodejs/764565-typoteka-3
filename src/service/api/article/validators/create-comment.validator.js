'use strict';

const Joi = require(`joi`);

const ErrorCommentMessage = {
  TEXT: `Комментарий содержит меньше 20 символов`
};

module.exports = Joi.object({
  text: Joi.string().min(20).required().messages({
    'string.min': ErrorCommentMessage.TEXT
  })
});
