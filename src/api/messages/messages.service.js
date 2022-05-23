const MessageModel = require('./messages.model')
class MessageService {
  async viewService(counts, limit) {
    const totalcounts = await MessageModel.count().exec()
    const messages = MessageModel
      .find({})
      .skip(counts)
      .limit(limit)
      .sort({ created_at: -1 })
      .exec()
    return {
      totalcounts,
      messages,
    }
  }

  async createService(nickname, message) {
    return MessageModel.create({ nickname, message })
  }
}

module.exports = MessageService
