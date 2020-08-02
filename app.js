require('dotenv').config();
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { PORT, DATA_URL } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cards = require('./routes/cards');
const users = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const { signInValid, signUpValid } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const { NotFoundError } = require('./errors/errors');

// Подключение к базе данных
mongoose.connect(DATA_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Логгер запросов
app.use(requestLogger);

// Краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('The server is about to crash');
  }, 0);
});

app.use('/cards', auth, cards);
app.use('/users', auth, users);
app.post('/signin', signInValid, login);
app.post('/signup', signUpValid, createUser);

// Логгер ошибок
app.use(errorLogger);

// Обработчик ошибок Celebrate
app.use(errors());

// Обработчик ошибки 404
app.use('*', () => {
  throw new NotFoundError('The requested resource was not found');
});

// Обработчик ошибок сервера
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'An error occurred on the server' : message,
  });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`The server is running on the port:${PORT}`);
});
