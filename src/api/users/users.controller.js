const { Router } = require('express')
const UserService = require('./users.service')
const UserRepository = require('./users.repository')
const wrapper = require('../../lib/request-handler')
const passport = require('passport')
const { BadRequestException, UnauthorizedException, HttpException } = require('../../common/exceptions')
const EMAIL_REGEX = new RegExp('[a-zA-Z0-9-_]+@likelion.org')

const { promisify } = require('util')
const { verifyUser } = require('../../middlewares/auth.middeware')
class UserController {
  constructor() {
    this.userService = new UserService(new UserRepository())

    this.path = '/users'
    this.router = Router()
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router
      .post('/login', this.loginController)
      .post('/firstlogin', verifyUser, wrapper(this.firstLoginController.bind(this)))
      .post('/logout', verifyUser, wrapper(this.logoutController.bind(this)))
      .get('/logincheck', verifyUser, wrapper(this.loginCheckController.bind(this)))
  }

  async loginController(req, res, next) {
    passport.authenticate('local', (err, user, _info) => {
      if (err) {
        return next(err);
      }
      return req.login(user, (err) => {  
        if (err) {
          return next(err);
        }
        const filteredUser = {
          email: user.email,
          name: user.name,
          nickname: user.nickname,
          firstlogin: user.firstlogin,
        }
        return res.status(200).json({
          success: true,
          message: 'Login success.',
          data: filteredUser,
        })
      })
    })(req, res, next);
  }

  async firstLoginController(req, res, next) {
    const { email: existingEmail } = req.user
    const { email, password, nickname } = req.body
    if (!email || !password || !nickname) {
      throw new BadRequestException('Wrong body info.')
    }
    if (email !== existingEmail) {
      throw new UnauthorizedException('Wrong user info.')
    }
    const updatedUser = await this.userService.firstLoginService(
      email,
      password,
      nickname
    )
    req.login(updatedUser, (err) => {
      if (err) {
        throw new HttpException(
          500,
          'Internal server error. (firstLoginController.'
        )
      }
    })
    const filteredUser = {
      email: updatedUser.email,
      name: updatedUser.name,
      nickname: updatedUser.nickname,
      firstlogin: updatedUser.firstlogin,
    }
    return {
      data: filteredUser,
    }
  }

  async logoutController(req, _res) {
    req.logout();
    await req.session.destroy();
    return {};
  }

  async loginCheckController(req, _res) {
    const { email, nickname, name, firstlogin } = req.user
    return {
      data: {
        email,
        name,
        nickname,
        firstlogin,
      }
    }
  }
}

module.exports = UserController
