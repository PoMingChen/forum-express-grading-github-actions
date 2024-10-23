const express = require('express')
const router = express.Router()


//新增，載入 controller（object）
const restController = require('../controllers/restaurant-controller')

//新增
const admin = require('./modules/admin') //新增這行，載入 admin.js
router.use('/admin', admin) //新增這行
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
