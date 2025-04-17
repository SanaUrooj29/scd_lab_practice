const mongoose = require('mongoose');
const User = require('./User')
const Car = require('./Car');

const bookingSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car', 
        required: true
    },
    startDate: Date,
    endDate: Date,
    status: {
        type: String,
        enum: ['active', 'cancelled'],
        default: 'active'
    }
})
module.exports = mongoose.model('Booking', bookingSchema)
