'use strict';

const Joi = require(`joi`);

const ErrorRegisterMessage = {
  FIRSTNAME: `Имя содержит некорректные символы`,
  LASTNAME: `Фамилия содержит некорректные символы`,
  EMAIL: `Некорректный электронный адрес`,
  EMAIL_EXIST: `Электронный адрес уже используется`,
  PASSWORD: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_REPEATED: `Пароли не совпадают`
};

module.exports = Joi.object({
  firstName: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.pattern.base': ErrorRegisterMessage.FIRSTNAME
  }),
  lastName: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    'string.pattern.base': ErrorRegisterMessage.LASTNAME
  }),
  email: Joi.string().email().required().messages({
    'string.email': ErrorRegisterMessage.EMAIL
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': ErrorRegisterMessage.PASSWORD
  }),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)).required().messages({
    'any.only': ErrorRegisterMessage.PASSWORD_REPEATED
  }),
  avatar: Joi.string().allow(``)
});
