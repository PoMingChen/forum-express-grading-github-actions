const { Restaurant, Category } = require('../models')
const adminServices = {
  getRestaurants: (req, cb) => {
    Restaurant.findAll({
      raw: true,
      nest: true, // 增加這裡
      include: [Category] // 增加這裡
    })
      .then(restaurants => { return cb(null, { restaurants }) }) // 當查詢成功時，調用 cb(null, { restaurants })，將餐廳資料傳遞給回調函數 cb。
      .catch(err => cb(err)) // 如果查詢失敗，調用 cb(err)，將錯誤傳遞給回調函數 cb。
  }
}

module.exports = adminServices
