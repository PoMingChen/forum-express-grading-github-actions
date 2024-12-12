const express = require('express')
const router = express.Router()
const passport = require('../../config/passport') // 新增這行
const upload = require('../../middleware/multer') // 載入 multer(這樣 UserProfile 的圖片才能上傳)
const admin = require('./modules/admin')
// const { authenticated } = require('../../middleware/auth')
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

// 這邊要一行可以直接導到 admin 路由模組
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.get('/restaurants', authenticated, restController.getRestaurants)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/signup', userController.signUp)

router.put('/users/:id', upload.single('image'), userController.putUser)

router.use('/', apiErrorHandler)

module.exports = router
