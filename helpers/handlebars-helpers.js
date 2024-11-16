const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')

// This line extends the core dayjs library with the relativeTime plugin. By calling dayjs.extend(relativeTime), you are adding the relative time functionality to the dayjs instance. This means that you can now use methods provided by the relativeTime plugin to format dates and times relatively.
dayjs.extend(relativeTime)

module.exports = {
  currentYear: () => dayjs().year(), // 取得當年年份作為 currentYear 的屬性值，並導出
  relativeTimeFromNow: a => dayjs(a).fromNow(), // 將日期轉換成相對時間
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },
  eq: (a, b) => a === b
}
