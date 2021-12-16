const mongoose = require('mongoose')

const validator = require('validator')

const citySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    }

});
citySchema.virtual('adds', {
    ref: 'Add',
    localField: '_id',
    foreignField: 'city'
})
const City = mongoose.model('City', citySchema);

module.exports = City;