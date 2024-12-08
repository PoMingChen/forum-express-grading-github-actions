const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
// const { authenticated } = require('../../middleware/auth')
const restController = require('../../controllers/apis/restaurant-controller')


// 這邊要一行可以直接導到 admin 路由模組
router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)

module.exports = router
