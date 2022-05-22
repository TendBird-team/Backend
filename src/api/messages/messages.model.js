const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  created_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('messages', MessageSchema)
