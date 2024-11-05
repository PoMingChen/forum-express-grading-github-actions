module.exports = {
  generalErrorHandler (err, req, res, next) {
    if (err instanceof Error) { // 首先判斷傳入的 err 是不是一個 Error 物件
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      req.flash('error_messages', `${err}`)
    }
    res.redirect('back')
    next(err)
  }
}
