const { UnauthorizedException } = require("../common/exceptions")

const verifyUser = (req, _res, next) => {
  const { userEmail } = req.session || req.cookies
  if (!userEmail) {
    next(new UnauthorizedException('login first.'))
  }
  next()
}

module.exports = verifyUser