const { celebrate, Joi } = require('celebrate');
const { BadRequestError } = require('../errors/errors');

const isUrl = (/http[s]?:\/\/(((\d{1,3}\.){3}\d{1,3})|(([a-zA-Z/\d-]+\.)?[[a-zA-Z/\d-]+\.[a-zA-Z]+))(:\d{2,5})?(\/[a-zA-Z/\d-]+#?)?/);

// Валидация Joi для роутов, получающих на вход id
const validId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

// Валидация Joi для роута создания карточки
const cardValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(isUrl).error((err) => {
      if (err[0].code === 'any.required') {
        return new BadRequestError('/link/ is required');
      }
      return new BadRequestError(`${err[0].local.value} is invalid link`);
    }),
  }),
});

// Валидация Joi для роута авторизации
const signInValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required().min(8),
  }),
});

// Валидация Joi для роута регистрации
const signUpValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().regex(isUrl).error((err) => {
      if (err[0].code === 'any.required') {
        return new BadRequestError('/Avatar/ is required');
      }
      return new BadRequestError(`${err[0].local.value} is invalid link`);
    }),
  }),
});

// Валидация Joi для роута редактирования информации профиля
const updateUserValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

// Валидация Joi для роута смены аватара профиля
const updateAvatarValid = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(isUrl).error((err) => {
      if (err[0].code === 'any.required') {
        return new BadRequestError('/Avatar/ is required');
      }
      return new BadRequestError(`${err[0].local.value} is invalid link`);
    }),
  }),
});

module.exports = {
  validId,
  cardValid,
  signInValid,
  signUpValid,
  updateUserValid,
  updateAvatarValid,
};
