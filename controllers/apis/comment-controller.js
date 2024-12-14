
const commentServices = require('../../services/comment-services')

const commentController = {
  postComment: (req, res, next) => {
    commentServices.postComment(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }

  // deleteComment: (req, res, next) => {
  //   return Comment.findByPk(req.params.id)
  //     .then(comment => {
  //       if (!comment) throw new Error("Comment didn't exist!")
  //       return comment.destroy()
  //     })
  //     .then(deletedComment => res.redirect(`/restaurants/${deletedComment.restaurantId}`))
  //     .catch(err => next(err))
  // }
}

module.exports = commentController
