const usersRouter = require('express').Router();
const { validId, updateUserValid, updateAvatarValid } = require('../middlewares/validation');
const {
  getUsers, getOneUser, updateUser, updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:_id', validId, getOneUser);
usersRouter.patch('/me', updateUserValid, updateUser);
usersRouter.patch('/me/avatar', updateAvatarValid, updateAvatar);

module.exports = usersRouter;
