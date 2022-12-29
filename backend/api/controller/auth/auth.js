const userModel = require("../../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
var dotenv = require('dotenv');
const JWT_SECRET_KEY = "" + process.env.TOKEN_KEY

function generateAuthToken(data){
  const token = jwt.sign(data, JWT_SECRET_KEY, { expiresIn: '10h' })
  return token
}

// module.exports.login = async(req, res) => {
//   try {

//     const { email, password } = req.body;
//     let user = await userModel.findOne({ email });

//     if (!user) {
//       return res.json({
//         success: true,
//         status: 400,
//         message: "người dùng không tồn tại với email và mật khẩu này",
//       });
//     }

//     // bcrypting the password and comparing with the one in db
//     if (await bcrypt.compare(password, user.password)) {
//       const data = await userModel.findById(user._id).select("-password")
//       const userType = data.userType
//       const token = generateAuthToken({_id : user?._id, email : email})
//       user.token = token
//       user.save()

//       return res.json({
//         success: true,
//         status: 200,
//         message: "người dùng đã đăng nhập",
//         data: user,
//         userType
//       });
//     }
//     return res.json({
//         success: false,
//         status: 400,
//         message: "thông tin đăng nhập của người dùng không chính xác",
//     })

//   } catch (error) {
//     return res.send(error.message);
//   }
// };

module.exports.login = async (req, res) => {
  try {
      const email = req.body.email
      const password = req.body.password
      const check = await userModel.findOne({ email })
      console.log(email, password)
      if (check) {
          const checkPassword = await bcrypt.compare(password, check.password)
          if (checkPassword) {
              const data = await userModel.findById(check._id).select("-password")
              const token = jwt.sign({ data }, 'secret', { expiresIn: '15m' })
              data.token = token
              console.log(data)
              res.send({ data, message: 'Đăng nhập thành công', status: 200 })
          } else {
              res.send({ passwordErrMess: 'Sai mật khẩu' })
          }
      } else {
          res.send({ userNameErrMess: 'Tên đăng nhập không tồn tại' })
      }
  } catch (error) {
      res.send({ message: 'Lỗi rồi' })
  }
}
// module.exports.register = async (req, res) => {
//   try {
//     const { email, password, name, userType } = req.body;

//     // if any one of the field from email and password is not filled
//     if (!email || !password) {
//       return res.json({
//         success: false,
//         message: "email hoặc mật khẩu trống",
//       });
//     }
//     req.body.password = await bcrypt.hash(password, 10);

//     let user = new userModel(req.body);
//     await user.save();

//     return res.json({
//       success: true,
//       message: "người dùng đã đăng ký thành công",
//       data: user,
//     });
//   } catch (error) {
//     return res.send(error.message);
//   }
// };

module.exports.register = async (req, res) => {
  try {
      const name = req.body.name
      const email = req.body.email
      const password = req.body.password
      console.log(name ,email )
      const check = await userModel.findOne({ email })
      if (check) {
          res.send({ messageFailure: 'Tài khoản đã tồn tại' })
      } else {
          const encryptPassword = await bcrypt.hash(password, 10)
          const registerAcc = await userModel.create({ name: name, email: email, password: encryptPassword })
          console.log(registerAcc)
          res.send({ success: true, registerAcc, messageSuccess: 'Tạo tài khoản thành công' })
      }
  } catch (error) {
      res.send({ message: 'Lỗi rồi' })
  }
}

module.exports.updateUser = async (req, res) => {
  try {

    const userDataToBeUpdated = req.body;
    const { id } = req.query;
    console.log(id)
    const user = await userModel.findOne({ _id: id });

    if (!user) return res.send("người dùng không tồn tại");

    let updatedUser = await userModel.findOneAndUpdate(
      { _id: id },
      userDataToBeUpdated,
      { new: true }
    );

    return res.json({
      success: true,
      message: "người dùng đã cập nhật thành công",
      data: updatedUser,
    });
  } catch (error) {
    return res.send("error : ", error.message);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.query;

    const user = await userModel.findOne({ _id: id });
    if (!user) return res.status(200).send("người dùng không tồn tại");

    await userModel.findOneAndDelete({ _id: id });
    
    return res.json({
      success: true,
      message: "người dùng đã xóa thành công",
    });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports.userById = async (req, res) => {
  try {
    const { id } = req.query;

    const user = await userModel.findOne({_id : id})
    if(!user) return res.send("người dùng không tồn tại")

    return res.json({
        success : true,
        message : "người dùng đã xóa thành công",
        data : user
    })

    }catch(error){
        return res.send("error : ", error.message)
    }
}

module.exports.resetPassword = async (req, res) => {

    try{
        const {password, newPassword} = req.body;
        const {id} = req.query
    
        if(!password || !newPassword || !id) return res.send("Các trường trống")
    
        let user = await userModel.findOne({_id : id})
    
        if(!user) return res.send("người dùng không tồn tại")
    
        // comparing the password from the password in DB to allow changes
        if(bcrypt.compare(password, user?.password)){
            // encrypting new password 
            user.password = await bcrypt.hash(newPassword,10)
            user.save()
            return res.json({
                success : true,
                message : "Đã cập nhật mật khẩu thành công"
            })
        }

        return res.json({
            success : false,
            message : "sai mật khẩu"
        })

    }catch(error){
        return res.send(error.message)
    }
    
}
