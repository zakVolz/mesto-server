const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config');
// eslint-disable-next-line import/order
const { ObjectId } = require('mongoose').Types;
const { NotFoundError, BadRequestError } = require('../errors/errors');

const opts = { runValidators: true, new: true };

module.exports.getUsers = async (req, res, next) => {
  const data = await User.find({});
  try {
    res.send({ data });
  } catch (err) { next(err); }
};

// eslint-disable-next-line consistent-return
module.exports.getOneUser = async (req, res, next) => {
  try {
    if (ObjectId.isValid(req.params._id)) {
      const {
        _id, email, name, about, avatar,
      } = await User.findById(req.params._id)
        .orFail(new BadRequestError('Invalid id'));
      return res.send({
        _id, email, name, about, avatar,
      });
    } throw new BadRequestError('Invalid id');
  } catch (err) {
    next(new NotFoundError('The profile is missing'));
  }
};

module.exports.createUser = async (req, res) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (password !== undefined && password.length >= 8) {
    try {
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
        email, password: hash, name, about, avatar,
      });
      return res.send(
        {
          data: {
            name: user.name, about: user.about, avatar: user.avatar, email: user.email,
          },
        },
      );
    } catch (err) {
      const code = err.name === 'ValidationError' ? 400 : 500;
      return res.status(code).send({ error: err.message });
    }
  } throw new BadRequestError('The password is missing or too short. Minimum of 8 characters');
};

module.exports.updateUser = async (req, res) => {
  const { name, about } = req.body;
  try {
    const item = await User.findByIdAndUpdate(req.user._id, { name, about }, opts);
    return res.send({ data: item });
  } catch (err) {
    const code = err.name === 'ValidationError' ? 400 : 500;
    return res.status(code).send({ error: err.message });
  }
};

module.exports.updateAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    const item = await User.findByIdAndUpdate(req.user._id, { avatar }, opts);
    return res.send({ data: item });
  } catch (err) {
    const code = err.name === 'ValidationError' ? 400 : 500;
    return res.status(code).send({ error: err.message });
  }
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  if (password && email !== null) {
    return User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET);
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        });
        res.send('Successful authorization');
      })
      .catch((err) => res.status(401).send({ message: err.message }));
  } throw new BadRequestError('Incorrect email or password');
};
