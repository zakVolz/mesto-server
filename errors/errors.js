const ForbiddenError = require('./forbidden');
const NotFoundError = require('./notFound');
const UnauthorizedError = require('./unauthorized');
const BadRequestError = require('./badRequest');

module.exports = {
  ForbiddenError, NotFoundError, UnauthorizedError, BadRequestError,
};
