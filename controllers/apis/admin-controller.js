const adminServices = require('../../services/admin-services')

const adminController = {
  getRestaurants: (req, res, next) => {

    //不能將回調函數寫成 cb(err, data) => err ? next(err) : res.json(data)，因為這樣的語法是不正確的。你需要傳遞一個匿名函數作為回調函數，這樣當 adminServices.getRestaurants 完成後，它會調用這個回調函數並傳遞 err 和 data 參數。
    adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.json({ status: 'success', data })) // 修改這裡
  }, // 加逗號

  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },

  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data })) // 修改這裡
  }
}

module.exports = adminController
