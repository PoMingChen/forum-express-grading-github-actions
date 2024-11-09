const { Restaurant, Category } = require('../models')

const restaurantController = {

  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      include: Category, // 一併拿出關聯的 Category model
      nest: true,
      raw: true
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))

      return res.render('restaurants', {
        restaurants: data
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
