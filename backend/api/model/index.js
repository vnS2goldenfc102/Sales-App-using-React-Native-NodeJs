const mongoose= require('mongoose')
const studentModel = new mongoose.Schema({
    name:{ 
        type:String 
    },
    age:{
        type: Number, 
    }
})

module.exports = mongoose.model('student',studentModel)