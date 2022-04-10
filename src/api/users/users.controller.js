const { Router } = require('express')
const UserService = require('./users.service')
const wrapper = require('../../lib/request-handler')

class UserController {
  constructor() {
    this.userService = new UserService()

    this.path = '/users'
    this.router = Router()
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router
      .post('/login', wrapper(this.login.bind(this)))
      .post('/firstlogin', wrapper(this.firstLogin.bind(this)))
      .post('/logout', wrapper(this.logout.bind(this)))
  }

  async login(req, res) {
    return {}
  }

  async firstLogin(req, res) {
    return {}
  }

  async logout(req, res) {
    return {}
  }
}

module.exports = UserController
