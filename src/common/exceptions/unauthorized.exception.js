const HttpException = require('./http.exception')

class UnauthorizedException extends HttpException {
  constructor(message = 'unauthorized error.') {
    super(401, message)
  }
}

module.exports = UnauthorizedException
