const { Router } = require('express')
const wrapper = require('../../lib/request-handler')
const { UnauthorizedException } = require('../../common/exceptions')
const { verifyUser } = require('../../middlewares/auth.middeware')

class MessageController {
  constructor(messageService) {
    this.messageService = messageService
    this.router = Router()
    this.path = '/messages'
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router
      .get('/', verifyUser, wrapper(this.viewController.bind(this)))
  }

  async viewController(req, res) {
    const { email } = req.user
    const { page = 0 } = req.query
    if (!userEmail) {
      throw new UnauthorizedException('Wrong user info.')
    }

    const messages = await this.messageService.viewService(page)
    return {
      message: 'Request successfully.',
      data: {
        page,
        messages,
      },
    }
  }
}

module.exports = MessageController
