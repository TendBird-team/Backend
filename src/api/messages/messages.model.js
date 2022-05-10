const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date,
  },
})

module.exports = mongoose.model('messages', MessageSchema)
