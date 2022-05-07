const { UnauthorizedException } = require("../common/exceptions")

const verifyUser = (req, _res, next) => {
  const { id } = req.session
  if (!id) {
    next(new UnauthorizedException('login first.'))
  }
  next()
}

module.exports = verifyUser