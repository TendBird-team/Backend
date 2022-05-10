const { Router } = require('express')
const UserService = require('./users.service')
const UserRepository = require('./users.repository')
const wrapper = require('../../lib/request-handler')
const { BadRequestException, UnauthorizedException, HttpException } = require('../../common/exceptions')
const verifyUser = require('../../middlewares/auth.middeware')
const EMAIL_REGEX = new RegExp('[a-zA-Z0-9-_]+@likelion.org')

class UserController {
  constructor() {
    this.userService = new UserService(new UserRepository())

    this.path = '/users'
    this.router = Router()
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router
      .post('/login', wrapper(this.loginController.bind(this)))
      .post('/firstlogin', verifyUser, wrapper(this.firstLoginController.bind(this)))
      .post('/logout', verifyUser, wrapper(this.logoutController.bind(this)))
      .get('/logincheck', verifyUser, wrapper(this.loginCheckController.bind(this)))
  }

  async loginController(req, res) {
    const { email, password } = req.body
    if (!email || !password) {
      throw new BadRequestException('Wrong body info.')
    }

    const isValidEmail = EMAIL_REGEX.test(email)
    if (!isValidEmail) {
      throw new BadRequestException('Invalid email.')
    }

    const user = await this.userService.loginService(email, password)
    req.session.userEmail = user.email
    req.session.save();
    console.log(user)
    return {
      message: 'Login success.',
      data: {
        user,
      },
    }
  }

  async firstLoginController(req, res) {
    const { userEmail } = req.session
    const { email, password, nickname } = req.body
    if (!email || !password || !nickname) {
      throw new BadRequestException('Wrong body info.')
    }
    if (email !== userEmail) {
      throw new UnauthorizedException('Wrong user info.')
    }
    const result = await this.userService.firstLoginService(email, password, nickname)
    res.session.userEmail = result.email
    res.session.save((err) => {
      if (err) {
        throw new HttpException(500, 'Session save failed.')
      }
      return {
        data: result,
      }
    })
  }

  async logoutController(req, res) {
    if (req.session) {
      req.session.destroy(() => {
        req.session
      })
    }
    return {}
  }

  async loginCheckController(req, res) {
    const { userEmail } = req.session
    return {
      data: {
        userEmail,
      }
    }
  }
}

module.exports = UserController
