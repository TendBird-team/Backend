const MessageModel = require('./messages.model')

class MessageRepository {
  async createMessage(userEmail, message, date) {
    return MessageModel.insert({ userEmail, message, date })
  }
}

module.exports = MessageRepository
