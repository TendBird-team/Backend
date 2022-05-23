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
    const { nickname } = req.user
    const { counts = 0, limit = 8 } = req.query
    const { totalCounts, messages } =
      await this.messageService.viewService(counts, limit)
    return {
      message: 'Request successfully.',
      data: {
        requester: nickname,
        totalCounts,
        messages,
      },
    }
  }
}

module.exports = MessageController
