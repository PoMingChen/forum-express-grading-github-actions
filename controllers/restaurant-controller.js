const { Restaurant, Category } = require('../models')

const restaurantController = {

  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || '' // 新增這裡，從網址上拿下來的參數是字串，先轉成 Number 再操作

    return Promise.all([
      Restaurant.findAll({
        include: Category,
        where: { // 新增查詢條件
          ...categoryId ? { categoryId } : {} // 檢查 categoryId 是否為空值（注意是先處理 trinity operator 的條件，然後 spread operator 才作用）
        },
        nest: true,
        raw: true
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId // 新增這裡，把 categoryId 帶到前端(以供前端判斷是否要加上 active class)
        })
      })
      .catch(err => next(err))
  },

  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category, // 一併拿出關聯的 Category model
      nest: true
      // raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        restaurant.increment('view_counts', { by: 1 })

        return res.render('restaurant', {
          restaurant: restaurant.toJSON()
        })
      })
      .catch(err => next(err))
  },

  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category, // 一併拿出關聯的 Category model
      nest: true,
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return res.render('dashboard', {
          restaurant: restaurant
        })
      })
      .catch(err => next(err))
  }
}

module.exports = restaurantController
