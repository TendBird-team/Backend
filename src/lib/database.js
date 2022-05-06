const mongoose = require('mongoose')

class DataBase {
  static async initializeDatabase() {
    return mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}
module.exports = DataBase
