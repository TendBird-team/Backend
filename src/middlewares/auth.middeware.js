const { UnauthorizedException } = require("../common/exceptions")
const passport = require('passport')
const bcrypt = require('bcrypt')
const { Strategy: LocalStrategy } = require('passport-local')
const UserModel = require('../api/users/users.model')

const verifyUser = (req, _res, next) => {
  const { user } = req;
  if (!user) {
    throw new UnauthorizedException('Login first.');
  }
  next();
}

const initializePassport = async () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  })

  passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id);
    if (!user) {
      done(new UnauthorizedException('Login first.'));
    }
    done(null, user);
  })

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        const user = await UserModel.findOne({ email })
        if (!user) {
          return done(new UnauthorizedException('Wrong email.'))
        }
        const { password: hashedPassword } = user
        const passwordCompareResult =
          await bcrypt.compare(password, hashedPassword)
        if (!passwordCompareResult) {
          return done(new UnauthorizedException('Wrong password.'))
        }
        return done(null, user)
      }
    )
  )
}

module.exports = {
  verifyUser,
  initializePassport,
}