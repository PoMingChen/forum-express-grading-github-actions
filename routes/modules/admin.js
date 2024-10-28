const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurant) //留意路由擺放的順序，應從嚴格到寬鬆(例如：/restaurants/create 應該放在 /restaurants/:id 前面，依此類推；/restaurants/:id 應該放在 /restaurants 前面）

router.get('/restaurants/:id/edit', adminController.editRestaurant) // 注意路由嚴謹程度
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', adminController.putRestaurant) // 修改這一行為 put
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', adminController.postRestaurant)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))
module.exports = router
