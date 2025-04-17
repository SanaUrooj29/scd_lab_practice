const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },

    maxBookings: {
        type: Number,
        required: true,
        default: 3
   },
   activeBookings: {
        type: Number,
   }
})

const User = mongoose.model('User', userSchema);

module.exports = User;