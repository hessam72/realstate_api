const mongoose = require('mongoose')

const validator = require('validator')

const addSchema = new mongoose.Schema({

    title: {
        required: true,
        type: String
    },
    description: {
        type: String
    },
    images: [{
        type: Buffer
    }],

    fields: [{
        field_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Field'
        },
        name: {
            type: String,
            required: true
        },
        value: {

        }
    }],
    category: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    city: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City'
    },
    owner: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true });

addSchema.index({ title: 'text', description: 'text' });

const Add = mongoose.model('Add', addSchema);

module.exports = Add;