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
require('dotenv').config()

class App {
  constructor(controllers) {
    this.app = express()

    this.initializeCors()
    this.initializeMiddleware()
    this.initializeSession()
    this.initialzeControllers(controllers)
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

  initialzeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router)
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
