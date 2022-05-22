const App = require('./app')
const UserController = require('./api/users/users.controller')
const DataBase = require('./lib/database')
const { initializePassport } = require('./middlewares/auth.middeware')
const MessageService = require('./api/messages/messages.service')
const MessageController = require('./api/messages/messages.controller')

const main = async () => {
  await DataBase.initializeDatabase()
  await initializePassport()
  const messageService = new MessageService()
  const app = new App(
    [new UserController(), new MessageController(messageService)],
    messageService
  )
  app.listen()
}
main()
