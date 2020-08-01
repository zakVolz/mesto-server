const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../config');
const { NotFoundError, BadRequestError, ConflictingRequest } = require('../errors/errors');

const opts = { runValidators: true, new: true };

module.exports.getUsers = async (req, res, next) => {
  try {
    const data = await User.find({});
    return res.send({ data });
  } catch (err) {
    return next(err);
  }
};

module.exports.getOneUser = async (req, res, next) => {
  try {
    const profile = await User.findById(req.params._id)
      .orFail(new NotFoundError('The profile is missing'));
    return res.send({
      _id: profile._id,
      email: profile.email,
      name: profile.name,
      about: profile.about,
      avatar: profile.avatar,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email, password: hash, name, about, avatar,
    });
    return res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    if (err.errors.email.kind === 'unique') {
      return next(new ConflictingRequest('Email is already in use'));
    }
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(err));
    }
    return next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    const item = await User.findByIdAndUpdate(req.user._id, { name, about }, opts);
    return res.send({ data: item });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(err));
    }
    return next(err);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const item = await User.findByIdAndUpdate(req.user._id, { avatar }, opts);
    return res.send({ data: item });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(err));
    }
    return next(err);
  }
};

module.exports.login = (req, res, next) => {
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
        res.send({ message: 'Successful authorization' });
      }).catch(next);
  }
  throw new BadRequestError('Incorrect email or password');
};
