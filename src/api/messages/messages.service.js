class MessageService {
  constructor(MessageRepository) {
    this.messageRepository = MessageRepository
  }

  async viewService(page) {
    return this.messageRepository.viewMessage(page)
  }

  async createService(userEmail, message, date) {
    return this.messageRepository.createMessage(userEmail, message, date)
  }
}

module.exports = MessageService
