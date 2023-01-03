const userModel = require("../../model/user")
const { ObjectId } = require('mongodb');


module.exports.addToWishlist = async (req, res) => {
    try {

        const data = req.body
        const addToWishlist = await userModel.findOneAndUpdate({ _id: data.id }, { $push: { wishlist: data } }, { new: true })
        return res.json({
            success: true,
            message: "Đã thêm vào Wishlist",
            data: addToWishlist
        })

    } catch (error) {
        return res.send(error.message)
    }
}

module.exports.removeFromWishlist = async (req, res) => {
    try {

        // const id = req.params.id
        // // let user = req.user
        // console.log(id)
        // const removeFromWishlist = await userModel.findOneAndUpdate({ _id: id }, { $pull: { wishlist: { productId: ObjectId(id) } } }, { new: true })
        // console.log(removeFromWishlist)
        // // const removeFromWishlist = await userModel.findOneAndDelete({ _id: id })
        const id = req.query.id // user
        const index = req.query.index // wishlist
        const user = await userModel.findById({ _id: id})
        await user.wishlist.splice(index, 1)
        await userModel.findByIdAndUpdate(id, { wishlist: user.wishlist })
        return res.json({
            success: true,
            message: "Đã xoá khỏi Wishlist",
            // data: removeFromWishlist
        })


    } catch (error) {
        return res.send(error.message)
    }
}

module.exports.wishlist = async (req, res) => {
    try {

        const _id = req.params.id
        // console.log(user)
        const wishlist = await userModel.findOne({ _id: _id })
            .populate("wishlist.productId")
            .select("-password -userType")
        console.log(wishlist, 'sadsadsad')
        return res.json({
            success: true,
            message: "Wishlist",
            data: wishlist
        })

    } catch (error) {
        return res.send(error.message)
    }
}