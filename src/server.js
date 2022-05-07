const App = require('./app')
const UserController = require('./api/users/users.controller')
const DataBase = require('./lib/database')

const main = async () => {
  await DataBase.initializeDatabase()
  const app = new App([new UserController()])
  app.listen()
}
main()
