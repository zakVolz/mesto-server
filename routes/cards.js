const cardsRouter = require('express').Router();
const { cardValid, validId } = require('../middlewares/validation');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardsRouter.post('/', cardValid, createCard);
cardsRouter.get('/', getCards);
cardsRouter.delete('/:_id', validId, deleteCard);
cardsRouter.put('/:_id/likes', validId, likeCard);
cardsRouter.delete('/:_id/likes', validId, dislikeCard);

module.exports = cardsRouter;
