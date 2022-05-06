const express = require('express')
const { NotFoundException } = require('./common/exceptions')
const errorMiddleware = require('./middlewares/error.middleware')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

class App {
  constructor(controllers) {
    this.app = express()

    this.initializeMiddleware()
    this.initialzeControllers(controllers)
    this.initializeNotFoundMiddleware()
    this.initializeErrorHandling()
  }

  initializeCors() {
    const domains = ['http://localhost:4000', 'http://localhost:4052'];
    this.app.use(
      cors({
        origin(origin, callback) {
          const isTrue = domains.indexOf(origin) !== -1;
          callback(null, isTrue);
        },
        allowHeaders: 'Content-Type',
        methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
        preflightContinue: false,
        credentials: true,
        optionsSuccessStatus: 200,
      })
    );
  }

  initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }

  initializeMiddleware() {
    this.app.use(session({
      secret: process.env.SECRET,
      saveUninitialized: true,
      resave: false,
      ttl: 14 * 24 * 60 * 60,
      touchAfter: 24 * 3600,
      autoRemove: 'interval',
      autoRemoveInterval: 10,
      store: new MongoStore({
        mongoUrl: process.env.DB_URI,
      })
    }))
    this.app.use(morgan('common'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeNotFoundMiddleware() {
    this.app.use((req, res, next) => {
      if (!req.route) next(new NotFoundException())
      next()
    })
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
