const Card = require('../models/card');

// eslint-disable-next-line import/order
const { ObjectId } = require('mongoose').Types;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((item) => res.send({
      data: item,
    }))
    .catch(() => res.status(500).send({
      message: 'Ошибка при загрузке карточек',
    }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
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

module.exports.deleteCard = (req, res) => Card.findById(req.params.cardId)
  .orFail(new Error('Ошибка при удалении карточки'))
  .then((obj) => {
    if (req.user._id !== obj.owner.toString()) {
      return res.status(403).send({
        message: 'У вас недостаточно прав для удаления этой карточки',
      });
    } return Card.findByIdAndDelete(req.params.cardId)
      .then((elemCard) => res.send(elemCard))
      .catch((err) => res.status(400).send({ message: err.message }));
  })
  .catch(() => {
    res.status(404).send({
      message: 'Ошибка! Такой карточки нет',
    });
  });

module.exports.likeCard = (req, res) => {
  if (!ObjectId.isValid(req.params.cardId)) {
    res.status(400).send({ message: 'Неправильный id' });
    return;
  } Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((item) => {
    if (item === null) {
      res.status(404).send({
        message: 'Ошибка! Такой карточки нет',
      });
    } else {
      res.send({
        data: item,
      });
    }
  }).catch(() => res.status(500).send({
    message: 'Ошибка. Лайк не установлен',
  }));
};

module.exports.dislikeCard = (req, res) => {
  if (!ObjectId.isValid(req.params.cardId)) {
    res.status(400).send({ message: 'Неправильный id' });
    return;
  } Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((item) => {
    if (item === null) {
      res.status(404).send({
        message: 'Ошибка! Такой карточки нет',
      });
    } else {
      res.send({
        data: item,
      });
    }
  }).catch(() => res.status(500).send({
    message: 'Ошибка при удалении лайка',
  }));
};
