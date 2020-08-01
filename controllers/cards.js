const Card = require('../models/card');
const {
  ForbiddenError, NotFoundError, BadRequestError,
} = require('../errors/errors');
// eslint-disable-next-line import/order
const { ObjectId } = require('mongoose').Types;

module.exports.getCards = async (req, res, next) => {
  try {
    const item = await Card.find({})
      .populate('owner');
    return res.send({
      data: item,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  try {
    const item = await Card.create({ name, link, owner: req.user._id });
    return res.send({ data: item });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError(err));
    } return next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    const obj = await Card.findById(req.params._id)
      .orFail(new NotFoundError('The card is missing'));
    if (req.user._id !== obj.owner.toString()) {
      throw new ForbiddenError('You can only delete your own cards');
    }
    const elemCard = await Card.findByIdAndDelete(req.params._id)
      .populate('owner');
    return res.send(elemCard);
  } catch (err) {
    return next(err);
  }
};

module.exports.likeCard = async (req, res, next) => {
  if (!ObjectId.isValid(req.params._id)) {
    return next(new BadRequestError('Invalid id'));
  } try {
    const item = await Card.findByIdAndUpdate(
      req.params._id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .populate('owner');
    if (item === null) {
      throw new NotFoundError('The card is missing');
    } return res.send({ data: item });
  } catch (err) {
    return next(err);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  if (!ObjectId.isValid(req.params._id)) {
    return next(new BadRequestError('Invalid id'));
  } try {
    const item = await Card.findByIdAndUpdate(
      req.params._id,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .populate('owner');
    if (item === null) {
      throw new NotFoundError('The card is missing');
    } return res.send({ data: item });
  } catch (err) {
    return next(err);
  }
};
