const bcrypt = require('bcrypt')
const { UnauthorizedException } = require('../../common/exceptions')
class UserService {
  constructor(UserRepository) {
    this.userRepository = UserRepository
  }

  async firstLoginService(email, password, nickname) {
    await this.userRepository.checkFirstLogin(email)
    const hashedPassword = await bcrypt.hash(password, 10)
    return this.userRepository.updatePasswordAndNickname(
      email,
      hashedPassword,
      nickname
    )
  }
}

module.exports = UserService
