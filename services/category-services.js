const { Category } = require('../models')

const categoryServices = {

  postCategory: (req, cb) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')

    return Category.create({ name })
      .then(category => {
        return cb(null, { category })
      })
      .catch(err => cb(err))
  },

  putCategory: (req, cb) => {
    const { name } = req.body
    if (!name) throw new Error('Category name is required!')

    // Handle asynchronous tasks concurrently
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        return category.update({ name })
      })
      .then(category => {
        return cb(null, { category })
      })
      .catch(err => cb(err))
  },

  getCategories: (req, cb) => {
    // 修改以下
    return Promise.all([
      Category.findAll({ raw: true }),
      req.params.id ? Category.findByPk(req.params.id, { raw: true }) : null
    ])
      .then(([categories, category]) => {
        if (category) {
          return cb(null, { categories, category })
        } else {
          return cb(null, { categories })
        }
      })
      .catch(err => cb(err))
  },

  deleteCategory: (req, cb) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) throw new Error("Category didn't exist!")
        return category.destroy()
      })
      .then(category => {
        return cb(null, { category })
      })
      .catch(err => cb(err))
  }
}
module.exports = categoryServices
