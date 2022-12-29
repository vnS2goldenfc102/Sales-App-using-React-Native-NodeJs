const userModel = require("../../model/user")
const { ObjectId } = require('mongodb');


module.exports.addToWishlist = async (req, res) => {
    try {

        const data = req.body
        // let user = req.user
        // console.log(data._id)
        // const addToWishlist = await userModel.findByIdAndUpdate(data.id, { $push: { wishlist: data } },{new : true})
        const addToWishlist = await userModel.findOneAndUpdate({ _id: data.id }, { $push: { wishlist: data } }, { new: true })
        // console.log(addToWishlist.data[0].wishlist)
        return res.json({
            success: true,
            message: "product pushed in wishlist successfully",
            data: addToWishlist
        })

    } catch (error) {
        return res.send(error.message)
    }
}

module.exports.removeFromWishlist = async (req, res) => {
    try {

        const id = req.params.id
        // let user = req.user
        console.log(id)
        const removeFromWishlist = await userModel.findOneAndUpdate({ _id: id }, { $pull: { wishlist: { productId: ObjectId(id) } } }, { new: true })
        // const removeFromWishlist = await userModel.findOneAndDelete({ _id: id })
        return res.json({
            success: true,
            message: "product removed from wishlist successfully",
            data: removeFromWishlist
        })

    } catch (error) {
        return res.send(error.message)
    }
}

module.exports.wishlist = async (req, res) => {
    try {

        const _id = req.params.id
        // console.log(user)
        const wishlist = await userModel.findOne({_id: _id})
            .populate("wishlist.productId")
            .select("-password -userType")
        console.log(wishlist.wishlist, 'sadsadsad')
        return res.json({
            success: true,
            message: "Wishlist",
            data: wishlist
        })

    } catch (error) {
        return res.send(error.message)
    }
}