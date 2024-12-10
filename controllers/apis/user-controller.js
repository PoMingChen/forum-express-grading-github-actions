const jwt = require('jsonwebtoken')
const userServices = require('../../services/user-services')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON() // 新增這一行
      delete userData.password // 新增這裡，刪除密碼，避免外洩
      // console.log('req.user:', userData) // 這邊的 req.user 是透過 passport 認證後，回傳的使用者資料
      // console.log(process.env.JWT_SECRET)
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },

  signUp: (req, res, next) => {
    // 如果兩次輸入的密碼不同，就建立一個 Error 物件並拋出
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')

    userServices.signUp(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}
module.exports = userController
