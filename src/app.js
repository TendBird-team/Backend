const express = require('express')
const { NotFoundException } = require('./common/exceptions')
const errorMiddleware = require('./middlewares/error.middleware')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const cors = require('cors')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const path = require('path')
const cookieParser = require('cookie-parser')
require('dotenv').config()

class App {
  constructor(controllers) {
    this.app = express()

    this.initializeMiddleware()
    this.initializeCors()
    this.initialzeControllers(controllers)
    this.initializeNotFoundMiddleware()
    this.initializeErrorHandling()
  }

  initializeCors() {
    // TODO: 실제 프로덕션 배포시에는 바꾸어야함.
    const domains = [
      'https://peaceful-parfait-bec695.netlify.app',
    ]
    const corsOptions = {
      origin(origin, callback) {
        const isTrue = domains.indexOf(origin) !== -1
        callback(null, isTrue)
      },
      allowHeaders: 'Content-Type',
      methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
      preflightContinue: false,
      credentials: true,
      optionsSuccessStatus: 200,
    }
    this.app.use(cors(corsOptions))
  }

  initializeErrorHandling() {
    this.app.use(errorMiddleware)
  }

  initializeMiddleware() {
    this.app.set('trust proxy', 1);
    this.app.use(cookieParser(process.env.SECRET));
    this.app.use(
      session({
        resave: false,
        saveUninitialized: false,
        secret: [process.env.SECRET, process.env.SECRET],
        cookie: {
          httpOnly: true,
          secure: true,
        },
        name: 'session-cookie',
      })
    )
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
