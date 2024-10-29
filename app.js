const path = require('path') // 引入 path 套件
const express = require('express')
const handlebars = require('express-handlebars') // 引入 express-handlebars

// 新增以下兩行，引入套件
const flash = require('connect-flash')
const methodOverride = require('method-override') // 引入套件 method-override
const session = require('express-session')
const passport = require('./config/passport') // 增加這行，引入 Passport
const { getUser } = require('./helpers/auth-helpers') // 增加這行，引入自定義的 auth-helpers.js
const handlebarsHelpers = require('./helpers/handlebars-helpers') // 引入 handlebars-helpers.js
const routes = require('./routes')

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret' // 新增這行
const db = require('./models') // 暫時新增這行，引入資料庫，檢查完可刪

// 註冊 Handlebars 樣板引擎，並指定副檔名為 .hbs
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
// 設定使用 Handlebars 做為樣板引擎
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true })) // 處理來自表單的 POST 請求，將請求體解析為 req.body（不然會是 req.body 會是 undefined）
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize()) // 初始化 Passport
app.use(passport.session()) // 增加這行，啟動 session 功能
app.use(flash()) // 掛載套件
app.use(methodOverride('_method')) // 使用 method-override
app.use('/upload', express.static(path.join(__dirname, 'upload'))) // 這部分會將 __dirname 路徑和 'upload' 路徑片段組合起來，形成到 upload 資料夾的絕對路徑。這樣的設定讓 Express 可以正確地找到 upload 資料夾，即使專案目錄位置有所改變也不會受影響。

// 嚴格說起來，這邊是可以用 middlewares/message-handler.js 去做到 SOC
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 warning_msg 訊息

  res.locals.user = getUser(req) // 增加這行
  next()
})
app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
