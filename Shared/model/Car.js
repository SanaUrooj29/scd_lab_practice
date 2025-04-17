const mongoose = require('mongoose')

const carSchema = mongoose.Schema({
    carId : {
        type: String,
        required: true
    },
    model : String,
    location: {
        type: String,
        required: true
    },
    isAvailable: Boolean
})

module.exports = mongoose.model('Car', carSchema)
