const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: '$2a$10$Eo7Jk3rIsZyAycTZM6Cnu.uChN/U/eZwQOIuLjhoXBvYRyuM4SCeO',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  firstlogin: {
    type: Boolean,
    default: true,
  }
})

module.exports = mongoose.model('users', UserSchema);