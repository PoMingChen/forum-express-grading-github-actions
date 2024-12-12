const { User } = require('../models')
const bcrypt = require('bcryptjs')
const { localFileHandler } = require('../helpers/file-helpers')

const userServices = {

  signUp: (req, cb) => {
    // 確認資料裡面沒有一樣的 email，若有，就建立一個 Error 物件並拋出
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10) // 前面加 return
      })
      // 讓這個 Promise resolve 的值可以傳到下一個 .then 裡面，下一個 .then 裡面的參數 hash 就會是加密過後的密碼。這種寫法可以減少巢狀層級，讓程式碼比較好讀
      .then(hash => User.create({ // 上面錯誤狀況都沒發生，就把使用者的資料寫入資料庫
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(user => cb(null, { user }))
      .catch(err => cb(err))
  },

  putUser: (req, cb) => {
    const { name } = req.body
    const { file } = req
    Promise.all([
      User.findByPk(req.params.id),
      localFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) throw new Error("User didn't exist!")
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(user => cb(null, { user }))
      .catch(err => cb(err))
  }
}

module.exports = userServices
