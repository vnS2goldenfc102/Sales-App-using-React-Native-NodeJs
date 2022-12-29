const ordersModel = require("../../model/order")

module.exports.orders = async (req, res) => {
    try{

        const id = req.params.id
        // console.log(user, 'dday la user')
        const orders = await ordersModel.find({user: id})
            .populate({path : "user" , select : "-password -token"})
            .populate("items.productId")
            .populate("items.categoryId")
        return res.json({
            success : true,
            message : "orders",
            data : orders
        })

    }catch(error){
        return res.send(error.message)
    }
}