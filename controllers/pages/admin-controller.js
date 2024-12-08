const adminServices = require('../../services/admin-services') // 新增這裡，引入 admin-services
const { Restaurant, User, Category } = require('../../models')
const { localFileHandler } = require('../../helpers/file-helpers')

const adminController = {

  // 修改以下
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, data) => err ? next(err) : res.render('admin/restaurants', data))
  },

  createRestaurant: (req, res, next) => {
    return Category.findAll({
      raw: true
    })
      .then(categories => res.render('admin/create-restaurant', { categories }))
      .catch(err => next(err))
  },

  // 修改以下
  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'restaurant was successfully created')
      req.session.createdData = data
      return res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { // 去資料庫用 id 找一筆資料
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        // If not found, throw an error to skip further execution and go directly to .catch
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('admin/restaurant', {
          restaurant, route: 'restaurants'
        })
      })
      .catch(err => next(err))
  },

  editRestaurant: (req, res, next) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, { raw: true }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurant, categories]) => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        res.render('admin/edit-restaurant', { restaurant, categories })
      })
      .catch(err => next(err))
  },

  putRestaurant: (req, res, next) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) throw new Error('Restaurant name is required!')

    const { file } = req

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
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      })
      .catch(err => next(err))
  },

  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.session.deletedData = data
      return res.redirect('/admin/restaurants')
    })
  },

  getUsers: (req, res, next) => {
    return User.findAll({ raw: true })
      .then(users => {
        res.render('admin/users', { users, route: 'users' })
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
