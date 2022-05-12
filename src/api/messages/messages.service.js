class MessageService {
  constructor(MessageRepository) {
    this.messageRepository = MessageRepository
  }

  async createService(userEmail, message, date) {
    return this.messageRepository.createMessage(userEmail, message, date)
  }
}

module.exports = MessageService
