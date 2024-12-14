const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/apis/admin-controller')
const categoryController = require('../../../controllers/apis/category-controller')

const upload = require('../../../middleware/multer')
router.delete('/restaurants/:id', adminController.deleteRestaurant) // 新增這裡
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.put('/restaurant/:id', upload.single('image'), adminController.putRestaurant)

router.post('/categories', categoryController.postCategory)
router.put('/categories/:id', categoryController.putCategory)
router.get('/categories', categoryController.getCategories)
router.delete('/categories/:id', categoryController.deleteCategory)

router.patch('/users/:id', adminController.patchUser)

module.exports = router
