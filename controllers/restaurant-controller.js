const restaurantController = { // restaurantController 是一個物件 (object)。

  // restaurantController 有不同的方法(Method），例如 getRestaurants ，這個方法目前是負責「瀏覽餐廳頁面」，也就是去 render 一個叫做 restaurants 的樣板。

  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}
module.exports = restaurantController // 記得要在檔案的最後一行，使用 module.exports 匯出 restaurantController，之後才能在其他檔案裡使用。
