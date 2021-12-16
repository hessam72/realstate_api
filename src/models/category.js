const mongoose = require('mongoose')

const validator = require('validator')

const categorySchema = new mongoose.Schema({

    name: {
        required: true,
        type: String
    },
    description: {
        type: String
    }


}, {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals
});

categorySchema.virtual('fields', {
    ref: 'Field',
    localField: '_id',
    foreignField: 'category'
})
categorySchema.virtual('adds', {
    ref: 'Add',
    localField: '_id',
    foreignField: 'category'
})
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;