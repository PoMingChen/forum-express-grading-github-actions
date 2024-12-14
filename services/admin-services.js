const { Restaurant, Category } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

const adminServices = {
  getRestaurants: (req, cb) => {
    Restaurant.findAll({
      raw: true,
      nest: true, // 增加這裡
      include: [Category] // 增加這裡
    })
      .then(restaurants => { return cb(null, { restaurants }) }) // 當查詢成功時，調用 cb(null, { restaurants })，將餐廳資料傳遞給回調函數 cb。
      .catch(err => cb(err)) // 如果查詢失敗，調用 cb(err)，將錯誤傳遞給回調函數 cb。
  },

  // 新增以下
  postRestaurant: (req, cb) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')
    const { file } = req
    return localFileHandler(file)
      .then(filePath => Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null,
        categoryId
      }))
      .then(newRestaurant => cb(null, { restaurant: newRestaurant }))
      .catch(err => cb(err))
  },

  putRestaurant: (req, cb) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req
    console.log(req.params.id)
    // Handle asynchronous tasks concurrently
    return Promise.all([
      Restaurant.findByPk(req.params.id),
      localFileHandler(file) // Send the file to file-helper for processing
    ])
      // After both tasks are completed; if any Promise throws an error, Promise.all() will immediately stop other Promises and jump to .catch(), passing the failure message.
      .then(([restaurant, filePath]) => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.update({ // 修改這筆資料
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image, // 如果 filePath 是 Truthy (使用者有上傳新照片) 就用 filePath，是 Falsy (使用者沒有上傳新照片) 就沿用原本資料庫內的值
          categoryId
        })
      })
      .then(updatedRestaurant => cb(null, { restaurant: updatedRestaurant }))
      .catch(err => cb(err))
  },

  deleteRestaurant: (req, cb) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) {
          const err = new Error("Restaurant didn't exist!")
          err.status = 404
          throw err
        }
        return restaurant.destroy()
      })
      .then(deletedRestaurant => cb(null, { restaurant: deletedRestaurant }))
      .catch(err => cb(err))
  }
}

module.exports = adminServices
