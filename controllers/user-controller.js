const bcrypt = require('bcryptjs') // 載入 bcrypt
const db = require('../models') // 實際上就是在匯入 models/index.js(進而取得所有模型和資料庫連線。)
const { User } = db // 一種解構賦值的語法

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(() => {
        res.redirect('/signin')
      })
  }
}
module.exports = userController
