const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
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
