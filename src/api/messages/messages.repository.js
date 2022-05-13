const MessageModel = require('./messages.model')

class MessageRepository {
  async viewMessage(page) {
    const limit = 25
    return MessageModel.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_at: -1 })
  }

  async createMessage(userEmail, message, date) {
    return MessageModel.insert({ userEmail, message, date })
  }
}

module.exports = MessageRepository
