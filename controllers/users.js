const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const key = require('../secretKey');
// eslint-disable-next-line import/order
const { ObjectId } = require('mongoose').Types;

const opts = { runValidators: true, new: true };

module.exports.getUsers = async (req, res) => {
  const data = await User.find({});
  try {
    res.send({ data });
  } catch (err) {
    res.status(500).send({
      message: 'Ошибка при загрузке пользователей',
    });
  }
};

module.exports.getOneUser = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params._id)) {
      const {
        _id, email, name, about, avatar,
      } = await User.findById(req.params._id)
        .orFail(new Error('Ошибка при поиске пользователя'));
      return res.send({
        _id, email, name, about, avatar,
      });
    } return res.status(400).send({
      message: 'Ошибка! Некорректный ID',
    });
  } catch (err) {
    return res.status(404).send({
      message: 'Ошибка! Такого пользователя нет',
    });
  }
};

module.exports.createUser = (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (password !== undefined && password.length >= 8) {
    return bcrypt.hash(password, 10)
      .then((hash) => User.create({
        email, password: hash, name, about, avatar,
      }))
      .then((user) => res.send(
        {
          data: {
            name: user.name, about: user.about, avatar: user.avatar, email: user.email,
          },
        },
      ))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(409).send({
            message: err.message,
          });
        } else {
          res.status(500).send({
            message: 'Internal server error',
          });
        }
      });
  } return res.status(400).send({
    message: 'Пароль отсутствует или слишком короткий. Минимум 8 символов',
  });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, opts)
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: err.message,
        });
      } else {
        res.status(500).send({
          message: 'Internal server error',
        });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, opts)
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: err.message,
        });
      } else {
        res.status(500).send({
          message: 'Internal server error',
        });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (password && email !== null) {
    return User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, key);
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        });
        res.send({ token });
      })
      .catch((err) => res.status(401).send({ message: err.message }));
  } return res.status(401).send({ message: 'Неправильные почта или пароль' });
};
