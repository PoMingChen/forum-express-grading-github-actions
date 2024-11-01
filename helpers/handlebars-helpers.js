const dayjs = require('dayjs')

module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為 currentYear 的屬性值，並導出
  eq: (a, b) => a === b // 新增 eq helper，用來判斷 a 是否等於 b
}
