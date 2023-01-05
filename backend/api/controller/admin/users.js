const userModel = require("../../model/user");

exports.getUsers = async(req, res) => {
    try {
        let users = await userModel.find({})
        res.send({
            status: "success",
            data: users
        })
    } catch (error) {
        res.send({ message: "Error: " + error})
    }
}