const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')
// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field （option 設定客製化選項）
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // so you may access req within session information(with flash messages) in callback.
  },
  // authenticate user（登入認證程序）
  (req, email, password, cb) => { // cb: callback, equivalent to done
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        bcrypt.compare(password, user.password).then(res => {
          if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          return cb(null, user)
        })
      })
  }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  // 修改以下
  return User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' }, // 寫法要對標 User model 裡面的設定
      { model: Restaurant, as: 'LikedRestaurants' }, // 寫法要對標 User model 裡面的設定
      { model: User, as: 'Followers' }, // 新增這行
      { model: User, as: 'Followings' } // 新增這行
    ]
  })
    // 修改以下
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})
module.exports = passport
