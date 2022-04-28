const express = require('express')
const { NotFoundException } = require('./common/exceptions')
const errorMiddleware = require('./middlewares/error.middleware')
require('dotenv').config()

class App {
  constructor(controllers) {
    this.app = express()

    this.initialzeControllers(controllers)
    this.initializeNotFoundMiddleware()
    this.initializeErrorHandling()
  }

  initializeErrorHandling() {
    this.app.use(errorMiddleware)
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
