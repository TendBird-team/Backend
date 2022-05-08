const { UnauthorizedException } = require("../common/exceptions")

const verifyUser = (req, _res, next) => {
  const { userEmail } = req.session
  console.log(req)
  if (!userEmail) {
    next(new UnauthorizedException('login first.'))
  }
  next()
}

module.exports = verifyUser