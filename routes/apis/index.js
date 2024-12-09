const express = require('express')
const router = express.Router()
const passport = require('../../config/passport') //新增這行
const admin = require('./modules/admin')
// const { authenticated } = require('../../middleware/auth')
const restController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller') //新增這行
const { apiErrorHandler } = require('../../middleware/error-handler')

// 這邊要一行可以直接導到 admin 路由模組
router.use('/admin', admin)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn) //新增這行，設定 disable sessions
router.get('/restaurants', restController.getRestaurants)
router.use('/', apiErrorHandler)

module.exports = router
