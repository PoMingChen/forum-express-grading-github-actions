const { Comment, User, Restaurant } = require('../models')

const commentServices = {
  postComment: (req, cb) => {
    const { text } = req.body
    const userId = req.user.id // Comes from the deserialized user object
    const restaurantId = req.params.restaurantId

    if (!text) throw new Error('Comment text is required!')
    return Promise.all([
      User.findByPk(userId),
      Restaurant.findByPk(restaurantId)
    ])
      .then(([user, restaurant]) => {
        if (!user) throw new Error("User didn't exist!")
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return Comment.create({
          text,
          restaurantId,
          userId
        })
      })
      .then(comment => cb(null, { comment }))
      .catch(err => cb(err))
  },

  deleteComment: (req, cb) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        if (!comment) throw new Error("Comment didn't exist!")
        return comment.destroy()
      })
      .then(comment => cb(null, { comment }))
      .catch(err => cb(err))
  }
}

module.exports = commentServices
