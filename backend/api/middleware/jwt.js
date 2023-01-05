// var jwt = require('jsonwebtoken');
// var { expressjwt: jwt } = require("express-jwt");

// const verify = jwt({
//     secret: "secret",
//     algorithms: ["HS256"],
//     getToken: function fromHeaderOrQuerystring(req) {
//       if (
//         req.headers.authorization &&
//         req.headers.authorization.split(" ")[0] === "Bearer"
//       ) {
//         return req.headers.authorization.split(" ")[1];
//       } else if (req.query && req.query.token) {
//         return req.query.token;
//       }
//       return null;
//     },
//   })

// const role = (req,res, next)=>{
//     const role= req.auth.data.userType
//     if(role != 'admin'){
//         res.send({ message: 'ban ko co quyen admin' })
//     }
//     else{
//         return next()
//     }

// }
// module.exports={
//     verify,
//     role
// }

const jwt = require("jsonwebtoken")
const TOKEN_KEY = "" + process.env.TOKEN_KEY
const userModel = require("../model/user")


module.exports.isAdmin = async (req, res, next) => {

    const {email} = req.body;
    // receiving token from the header
    let token = req.headers["x-auth-token"] || req.body.token || req.query.token;

    if(token){
        try{
            // decode token with TOKEN key to extract the user
            const decoded = jwt.verify(token,TOKEN_KEY)

            // saving the current user in req.user
            req.user = decoded

            // checking if the logged in user is ADMIN or not
            const user = await userModel.findOne({_id : decoded?._id, userType : "ADMIN"})
                .select("-password")

            if(!user){
                // if not admin
                return res.send("Insufficient User Permissions")
            }

            // if admin, pass to the next function call
            return next()

        }catch(error){
            return res.status(401).json({ msg: "Invalid User Auth Token", err: error.message });     
        }

    }
    else{
        return res.status(400).json({ msg: "No Auth Token Found", err: "No Auth Token Found" });
    }
}


module.exports.checkAuth = async (req, res, next) => {
    try{

        let token = req.headers["x-auth-token"] || req.body.token || req.query.token;
        console.log(token)
        if(token){
            try{

                const decoded = jwt.verify(token,TOKEN_KEY)
                req.user = decoded
            
                const user = await userModel.findOne({_id : decoded?._id})
                    .select("-password")
                console.log(user,'la gi')
                if(!user){
                    return res.send("Authentication failed")
                }
                return next()

            }catch(error){
                
                return res.status(401).json({ msg: "Invalid User Auth Token", err: error.message });     
            }
        
        }
        else{
            return res.status(400).json({ msg: "No Auth Token Found", err: "No Auth Token Found" });
        }

    }catch(error){

    }
}