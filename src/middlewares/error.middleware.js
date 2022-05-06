const ErrorMiddleware = (err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Internal server error.'
  if (req.session) {
    req.session.destroy(() => {
      req.session
    })
  }
  res.status(status).json({
    success: false,
    message,
  })
  next()
}

module.exports = ErrorMiddleware
