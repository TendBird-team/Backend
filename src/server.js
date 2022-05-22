const App = require('./app')
const UserController = require('./api/users/users.controller')
const DataBase = require('./lib/database')
const { initializePassport } = require('./middlewares/auth.middeware')

const main = async () => {
  await DataBase.initializeDatabase()
  await initializePassport()
  const app = new App([new UserController()])
  app.listen()
}
main()
