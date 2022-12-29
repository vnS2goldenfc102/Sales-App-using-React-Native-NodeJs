const mongoose = require('mongoose')

const accountModel = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        role: {
            type: 'string',
            enum: ['admin', 'user'],
            default: 'user'
        }
    }
)

module.exports = mongoose.model('account', accountModel)
