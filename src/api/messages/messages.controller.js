const { Router } = require('express')
const MessageService = require('./messages.service')
const MessageRepository = require('./messages.repository')
const wrapper = require('../../lib/request-handler')
const { UnauthorizedException } = require('../../common/exceptions')

class MessageController {
  constructor() {
    this.messageService = new MessageService(new MessageRepository())

    this.router = Router()
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router
      .get('/message', wrapper(this.viewController.bind(this)))
      .post('/message', wrapper(this.createController.bind(this)))
  }

  async viewController(req, res) {
    const { userEmail } = req.session
    const { page } = req.Params
    if (!userEmail) {
      throw new UnauthorizedException('Wrong user info.')
    }

    return {
      message: 'Request successfully.',
      data: {
        page,
        messages,
      },
    }
  }

  async createController(req, res) {
    const { userEmail } = req.session
    const { message, date } = req.body
    if (!userEmail) {
      throw new UnauthorizedException('Wrong user info.')
    }
    if (!message || !date) {
      throw new BadRequestException('Wrong body info.')
    }

    const msg = await this.messageService.createService(
      userEmail,
      message,
      date
    )
    return {
      message: 'Request successfully',
      data: {
        msg,
      },
    }
  }
}

module.exports = MessageController
