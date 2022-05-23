const express = require('express')
const { NotFoundException } = require('./common/exceptions')
const errorMiddleware = require('./middlewares/error.middleware')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const cors = require('cors')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const path = require('path')
const passport = require('passport')
const expressWs = require('express-ws')

require('dotenv').config()

class App {
  constructor(controllers, messageService) {
    this.app = express()

    this.initializeCors()
    this.initializeMiddleware()
    this.initializeSession()
    this.initializeWebsocket(messageService)
    this.initializeControllers(controllers)
    this.initializeNotFoundMiddleware()
    this.initializeErrorHandling()    
  }

  initializeCors() {
    // TODO: 실제 프로덕션 배포시에는 바꾸어야함.
    const domains = [
      'https://peaceful-parfait-bec695.netlify.app',
    ]
    this.app.use(
      cors({
        origin(origin, callback) {
          const isTrue = domains.indexOf(origin) !== -1;
          callback(null, isTrue);
        },
        allowHeaders: 'Origin, Content-Type, X-Requested-With, Accept',
        methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
        preflightContinue: false,
        credentials: true,
        optionsSuccessStatus: 200,
      })
    );
  }

  initializeMiddleware() {
    this.socket = expressWs(this.app)
    this.app.use(morgan('common'))
    this.app.use(express.json({ extended: true, limit: '50mb' }))
    this.app.use(express.urlencoded({ extended: true, limit: '50mb' }))
    this.app.use(favicon(path.join(__dirname, '../public/images', 'favicon.ico')))
  }

  initializeSession() {
    this.app.use(
      session({
        secret: 'SECRET_CODE',
        resave: true,
        saveUninitialized: false,
        cookie: {
          maxAge: 1 * 60 * 60 * 1000,
        },
        store: MongoStore.create({
          mongoUrl: process.env.DB_URI,
          autoRemove: 'interval',
          autoRemoveInterval: 10,
          dbName: 'myFirstDatabase',
        }),
      })
    )
    this.app.use(passport.initialize())
    this.app.use(passport.session())
  }

  initializeNotFoundMiddleware() {
    this.app.use((req, _res, next) => {
      if (!req.route) next(new NotFoundException())
      next()
    })
  }

  initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }

  initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router)
    })
  }

  initializeWebsocket(messageService) {
    this.app.ws('/messages', (ws, req) => {
      ws.on('message', async (msg) => {
        const { user } = req
        if (!user) {
          return ws.send(JSON.stringify({
            success: false,
            errMessage: "Login first.",
          }))
        }
        const { nickname } = user
        if (!nickname) {
          return ws.send(JSON.stringify({
            success: false,
            errMessage: "Set Nickname first.",
          }))
        }
        try {
          const receivedObj = JSON.parse(msg)
          const { message } = receivedObj
          if (!message) {
            return ws.send(JSON.stringify({
              success: false,
              errMessage: `receivedObj is ${receivedObj}.`,
            }))
          }
          const { created_at } = await messageService.createService(
            nickname,
            message
          )
          const { clients } = this.socket.getWss().clients
          clients.forEach((client) => {
            client.send(
              JSON.stringify({
                success: true,
                data: {
                  message,
                  nickname,
                  created_at,
                },
              })
            )
          })
        } catch (err) {
          return ws.send(JSON.stringify({
            success: false,
            errMessage: err,
          }))
        }
      })
    })
  }

  listen() {
    const PORT = process.env.PORT || 3000
    this.app.listen(PORT, () => {
      console.log(`App listening on ${PORT}`)
    })
  }
}

module.exports = App
