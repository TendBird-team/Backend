const { Schema, model } = require('mongoose')
const firstPassword = process.env.FIRST_PASSWORD

const property = {
  createdAt: { type: Date, default: Date.now },
  lastLoggedAt: { type: Date },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: firstPassword,
  },
  name: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    default: '익명의 사자',
  },
}

const userScheme = new Schema(property)

module.exports = model('user', userScheme)
