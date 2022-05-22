const { Router } = require('express')
const wrapper = require('../../lib/request-handler')
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

  async viewController(req, _res) {
    const { page = 0, limit = 10 } = req.query

    const { totalCount, messages } = await this.messageService.viewService(page, limit)
    return {
      message: 'Request successfully.',
      data: {
        totalCount,
        messages,
      },
    }
  }
}

module.exports = MessageController
