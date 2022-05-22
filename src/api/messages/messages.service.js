const MessageModel = require('./messages.model')
class MessageService {
  async viewService(page, limit) {
    return MessageModel
      .find({})
      .skip(page * limit)
      .limit(limit)
      .sort({ created_at: -1 })
      .exec()
  }

  async createService(nickname, message) {
    return MessageModel.create({ nickname, message })
  }
}

module.exports = MessageService
