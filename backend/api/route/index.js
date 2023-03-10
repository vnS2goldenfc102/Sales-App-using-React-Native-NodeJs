// const studentController = require('../controller/index')
const usersController = require('../controller/admin/users')
const viewOrdersController = require('../controller/admin/orders')
const accountController = require('../controller/auth/auth')
const productController = require('../controller/products/products')
const categoryController = require('../controller/categories/category')
const orderController = require('../controller/user/orders')
const wishListController = require('../controller/user/wishlist')
const checkoutController = require('../controller/user/cart')
const auth = require('../middleware/jwt')
let fs = require('fs')

const routes = (app, upload) => {
    // app.route('/student/:id')
    //     .delete(auth.verify,auth.role,studentController.deleteStudent)
    //     .put(auth.verify,auth.role,studentController.updateStudent)
    // app.route('/student/search')
    //     .get(auth.verify,studentController.searchStudent)
    // app.route('/student')
    //     .get(auth.verify,studentController.getStudent)
    //     .post(auth.verify,auth.role,studentController.addStudent)  
    app.route('/register')
        .post(accountController.register)
    app.route('/login')
        .post(accountController.login)
    // User Routes
    app.route("/update-user")
        .post(accountController.updateUser)
    app.route("/user")
        .get(accountController.userById)
    app.route("/delete-user")
        .get(accountController.deleteUser)
    app.route("/reset-password")
        .post(accountController.resetPassword)
    // Products
    app.route("/product")
        .post(productController.addProduct)
    app.route("/products")
        .get(productController.getProducts)
    app.route("/update-product")
        .post(productController.updateProduct)
    app.route("/delete-product")
        .get(productController.deleteProduct)

    // CATEGORIES
    app.route("/category")
        .post(categoryController.addCategory)
    app.route("/categories")
        .get(categoryController.getCategories)
    app.route("/update-category")
        .post(categoryController.updateCategory)
    app.route("/delete-category")
        .get(categoryController.deleteCategory)
    // ORDERS
    app.route("/orders/:id")
        .get(orderController.orders)
    // WISHLIST
    app.route("/add-to-wishlist")
        .post(wishListController.addToWishlist)
    app.route("/wishlist/:id")
        .post(wishListController.wishlist)
    app.route("/remove-from-wishlist")
        .delete(wishListController.removeFromWishlist)
    // CHECKOUT
    app.route("/checkout")
        .post(checkoutController.checkout)
    // ADMIN
    app.route("/admin/users")
        .get(usersController.getUsers)
    app.route("/admin/orders")
        .get(viewOrdersController.getOrders)
    app.route("/admin/order-status")
        .get(viewOrdersController.getOrderStatus)
    // HELPER
    app.post('/upload', (req, res) => {
        console.log(req.file);
        fs.rename(req.file.path, req.file.path + ".jpg", () => {
            res.send('File uploaded!');
        })
      });
      

}
module.exports = routes