const mongoose = require('mongoose')

class DataBase {
  static async initializeDatabase() {
    await mongoose.connect('mongodb://127.0.0.1:27017/tendbird')
    console.log('DB connected at port 27017.')
  }
}

module.exports = DataBase
