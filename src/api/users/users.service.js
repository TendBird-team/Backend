const bcrypt = require('bcrypt')
const { UnauthorizedException } = require('../../common/exceptions')
class UserService {
  constructor(UserRepository) {
    this.userRepository = UserRepository
  }

  async #checkUser(email, password) {
    const user = await this.userRepository.findByEmail(email)
    const isCorrectPassword = await bcrypt.compare(password, user.password)
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Login failed. (wrong password)')
    }
    return user
  }

  async loginService(email, password) {
    const user = await this.#checkUser(email, password)
    return {
      userEmail: user.email,
      name: user.name,
      nickname: user.nickname,
      firstlogin: user.firstlogin,
    }
  }

  async firstLoginService(email, password, nickname) {
    await this.userRepository.checkFirstLogin(email)
    const hash = await bcrypt.hash(password, 10)
    return this.userRepository.updatePasswordAndNickname(email, hash, nickname)
  }
}

module.exports = UserService
