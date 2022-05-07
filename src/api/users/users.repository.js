const { UnauthorizedException, BadRequestException } = require('../../common/exceptions')
const UserModel = require('./users.model')

class UserRepository {
  async findByEmail(email) {
    const user = await UserModel.findOne({ email, }).exec()
    if (!user) {
      throw new UnauthorizedException('Login failed. (wrong email)')
    }
    return user
  }

  async checkFirstLogin(email) {
    const user = await UserModel.findOne({ email, }).exec()
    if (!user) {
      throw new BadRequestException('Bad request.')
    }
    const { firstlogin } = user
    if (!firstlogin) {
      throw new BadRequestException('Not first login.')
    }
  }

  async updatePasswordAndNickname(email, password, nickname) {
    return UserModel.updateOne(
      { email },
      {
        password,
        nickname,
        firstlogin: false,
      }
    ).exec()
  }

  async create(email, hash, name, nickname) {
    return UserModel.insertMany([{
      email,
      password: hash,
      name,
      nickname,
    }])
  }
}

module.exports = UserRepository
