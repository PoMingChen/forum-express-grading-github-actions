const { User, Followship } = require('../models')
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
  },

  addFollowing: (req, cb) => {
    const { userId } = req.params // 取得欲追蹤的使用者 id（可以參考 router.post('/following/:userId' ...）
    Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id, // 目前登入的使用者 id
          followingId: req.params.userId // 欲追蹤的使用者 id
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(userFollowship => cb(null, { userFollowship }))
      .catch(err => cb(err))
  },

  removeFollowing: (req, cb) => {
    Followship.findOne({
      where: {
        followerId: req.user.id, // 目前登入的使用者 id
        followingId: req.params.userId // 欲『退追蹤』的使用者 id
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(userFollowshipDeletion => cb(null, { userFollowshipDeletion }))
      .catch(err => cb(err))
  }

}

module.exports = userServices
