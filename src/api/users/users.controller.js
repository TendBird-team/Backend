const { Router } = require('express')
const UserService = require('./users.service')
const UserRepository = require('./users.repository')
const wrapper = require('../../lib/request-handler')
const { BadRequestException } = require('../../common/exceptions')

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
      .post('/firstlogin', wrapper(this.firstLoginController.bind(this)))
      .post('/logout', wrapper(this.logoutController.bind(this)))
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

    const isFirstLogin = await this.userService.loginService(email, password)
    return {
      message: 'Login success.',
      data: {
        isfirst: isFirstLogin,
      },
    }
  }

  async firstLoginController(req, res) {
    const { email } = req
    const { password, nickname } = req.body
    if (!email || !password || !nickname) {
      throw new BadRequestException('Wrong body info.')
    }

    return this.UserService.firstLoginService(email, password, nickname)
  }

  async logoutController(req, res) {
    return {}
  }
}

module.exports = UserController
