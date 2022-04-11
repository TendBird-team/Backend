const App = require('./app')
const UserController = require('./api/users/users.controller')
const main = async () => {
  const app = new App([new UserController()])
  app.listen()
}
main()
