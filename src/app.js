const express = require('express')
const { NotFoundException } = require('./common/exceptions')
const errorMiddleware = require('./middlewares/error.middleware')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const cors = require('cors')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const path = require('path')
require('dotenv').config()

class App {
  constructor(controllers) {
    this.app = express()

    this.initializeCors()
    this.initializeMiddleware()
    this.initialzeControllers(controllers)
    this.initializeNotFoundMiddleware()
    this.initializeErrorHandling()
  }

  initializeCors() {
    // TODO: 실제 프로덕션 배포시에는 바꾸어야함.
  
    const corsOpt = {
      origin: function(origin, callback){
        const isTrue = domains.indexOf(origin) !== -1;
        callback(null, isTrue);
      },
      credentials: true
    }
    this.app.options('*', cors(corsOpt));
    this.app.use(cors(corsOpt))
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
    this.app.use(favicon(path.join(__dirname, '../public/images', 'favicon.ico')));
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
