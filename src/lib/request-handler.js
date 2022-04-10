const wrapper = (handler) => async (req, res, next) => {
  try {
    const { data = {}, message = 'Request successfully.' } = await handler(req, res, next)
    res.status(200).json({
      success: true,
      message,
      data,
    })
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = wrapper
