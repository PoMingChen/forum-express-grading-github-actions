const express = require('express')
const handlebars = require('express-handlebars') // 引入 express-handlebars
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const db = require('./models') // 暫時新增這行，引入資料庫，檢查完可刪

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs' }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true })) // 處理來自表單的 POST 請求，將請求體解析為 req.body（不然會是 req.body 會是 undefined）
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
