const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
// const { authenticated } = require('../../middleware/auth')
const restController = require('../../controllers/apis/restaurant-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')


// 這邊要一行可以直接導到 admin 路由模組
router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)
router.use('/', apiErrorHandler)

module.exports = router
