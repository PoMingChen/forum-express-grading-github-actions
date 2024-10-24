const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')

// 新增，載入 controller（object）
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller') // 新增這行
const { generalErrorHandler } = require('../middleware/error-handler') // 加入這行

// 新增
router.use('/admin', admin) // 新增這行
// 新增下面這兩行，注意順序
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) // 注意用 post
router.get('/restaurants', restController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)  // 加入這行

module.exports = router
