const orderModel = require("../../model/order");

exports.getOrders = async(req, res) => {
    try {
        let orders = await orderModel.find({})
        res.send({
            status: "success",
            data: orders
        })
    } catch (error) {
        res.send({ message: "Error: " + error})
    }
}

exports.getOrderStatus = async(req, res) => {
    try {
        let orderId = req.query.orderId
        let status = req.query.status
        await orderModel.findByIdAndUpdate(orderId, {status: status})
        res.send({
            success: true,
            message: "Order Status Updated"
        })
    } catch (error) {
        res.send({ message: "Error: " + error})
    }
}