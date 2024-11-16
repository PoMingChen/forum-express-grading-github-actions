const getOffset = (limit = 10, page = 1) => (page - 1) * limit

const getPagination = (limit = 10, page = 1, total = 50) => {
  const totalPage = Math.ceil(total / limit) // 無條件進位

  // The underscore _ is a common convention in JavaScript to indicate that the parameter is intentionally unused.
  // The first parameter of the mapping function is the current element value. In this case, since we are creating an array of a specific length without initial values, the current element value is not relevant.
  const pages = Array.from({ length: totalPage }, (_, index) => index + 1) // creates a new array instance from an array-like or iterable object.
  const currentPage = page < 1 ? 1 : page > totalPage ? totalPage : page // evaluate `page > totalPage ? totalPage : page` first
  const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
  const next = currentPage + 1 > totalPage ? totalPage : currentPage + 1
  return {
    pages,
    totalPage,
    currentPage,
    prev,
    next
  }
}
module.exports = {
  getOffset,
  getPagination
}
