const ForbiddenError = require('./forbidden'); // 403
const NotFoundError = require('./notFound'); // 404
const UnauthorizedError = require('./unauthorized'); // 401
const BadRequestError = require('./badRequest'); // 400
const ConflictingRequest = require('./conflictingRequest'); // 409

module.exports = {
  ForbiddenError, NotFoundError, UnauthorizedError, BadRequestError, ConflictingRequest,
};
