const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer') // 載入 multer

router.get('/restaurants/create', adminController.createRestaurant) //留意路由擺放的順序，應從嚴格到寬鬆(例如：/restaurants/create 應該放在 /restaurants/:id 前面，依此類推；/restaurants/:id 應該放在 /restaurants 前面）

router.get('/restaurants/:id/edit', adminController.editRestaurant) // 注意路由嚴謹程度
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant) // 修改後台編輯餐廳的路由
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant) // 修改後台新增餐廳的路由
router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))
module.exports = router
