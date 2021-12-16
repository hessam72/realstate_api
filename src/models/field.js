const mongoose = require('mongoose')

const validator = require('validator')

const fieldSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    type: {
        // 0=> string / 1 =>numeric etc...
        type: Number,
        required: true
    },
    category: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }

});

const Field = mongoose.model('Field', fieldSchema);

module.exports = Field;