const { UnauthorizedException } = require("../common/exceptions")

const verifyUser = (req, _res, next) => {
  const { email } = req.session
  console.log(email)
  if (!email) {
    next(new UnauthorizedException('login first.'))
  }
  next()
}

module.exports = verifyUser