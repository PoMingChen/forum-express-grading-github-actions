const { Restaurant, User } = require('../models')
const { localFileHandler } = require('../helpers/file-helpers')

const adminController = {

  getRestaurants: (req, res, next) => {
    Restaurant.findAll({
      raw: true
    })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
      .catch(err => next(err))
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create-restaurant')
  },

  postRestaurant: (req, res, next) => {
    // Extract data from the form in req.body
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!') // Name is required

    const { file } = req

    // Pass the extracted file to file-helper for processing, and then create the restaurant data
    localFileHandler(file)
      .then(filePath => Restaurant.create({
        name,
        tel,
        address,
        openingHours,
        description,
        image: filePath || null
      }))
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },

  getRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, { // Find the record in the database by id
      raw: true
    })
      .then(restaurant => {
        // If not found, throw an error to skip further execution and go directly to .catch
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/restaurant', {
          restaurant, activeTab: 'restaurants'
        })
      })
      .catch(err => next(err))
  },

  editRestaurant: (req, res, next) => {
    Restaurant.findByPk(req.params.id, {
      raw: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/edit-restaurant', { restaurant })
      })
      .catch(err => next(err))
  },

  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description } = req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req

    // Handle asynchronous tasks concurrently
    Promise.all([
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
          image: filePath || restaurant.image // If the file is not uploaded, use the original image
        })
      })
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },

  deleteRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return restaurant.destroy()
      })
      .then(() => res.redirect('/admin/restaurants'))
      .catch(err => next(err))
  },

  getUsers: (req, res, next) => {
    return User.findAll({ raw: true })
      .then(users => {
        res.render('admin/users', { users, activeTab: 'users' })
      })
      .catch(err => next(err))
  },

  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user || user.email === 'root@example.com') {
          if (!user) {
            throw new Error('User not found')
          } else {
            req.flash('error_messages', '禁止變更 root 權限')
            return res.redirect('back')
          }
        }
        const isAdminUpdated = !user.isAdmin
        return user.update({ isAdmin: isAdminUpdated }) // the user instance has the property called isAdmin, not is_admin (the column name in the database)
      })
      .then(user => {
        req.flash('success_messages', '使用者權限變更成功')
        res.redirect('/admin/users')
      })
      .catch(err => next(err))
  }

}

module.exports = adminController
