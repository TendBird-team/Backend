const MessageModel = require('./messages.model')
class MessageService {
  async viewService(page) {
    const limit = 25
    return MessageModel.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_at: -1 })
  }

  async createService(email, message) {
    return MessageModel.create({ email, message })
  }
}

module.exports = MessageService
