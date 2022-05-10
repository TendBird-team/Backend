const { UnauthorizedException } = require("../common/exceptions")

const verifyUser = (req, _res, next) => {
  console.log(req.session)
  const { userEmail } = req.session
  if (!userEmail) {
    next(new UnauthorizedException('login first.'))
  }
  next()
}

module.exports = verifyUser