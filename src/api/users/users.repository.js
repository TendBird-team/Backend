const { BadRequestException } = require('../../common/exceptions')
const UserModel = require('./users.model')

class UserRepository {
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
    return UserModel.findOneAndUpdate(
      { email },
      {
        password,
        nickname,
        firstlogin: false,
      },
      {
        new: true,
      },
    ).exec()
  }
}

module.exports = UserRepository
