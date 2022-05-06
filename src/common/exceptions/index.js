const HttpException = require('./http.exception')
const BadRequestException = require('./badRequest.exception')
const NotFoundException = require('./notFound.exception')
const UnauthorizedException = require('./unauthorized.exception')

module.exports = {
  HttpException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException
}
