const mongoose = require('mongoose')
const User = require('../models/user')
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
    //adds should be activated by admin
    is_active: {
        type: Boolean,
        default: false
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
    },
    saved_by: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

}, { timestamps: true });

addSchema.index({ title: 'text', description: 'text' });

addSchema.post('find', async function(docs) {
    //loop array and only return the active adds
    docs.forEach((doc) => {
        if (!doc.is_active) {
            docs.splice(docs.indexOf(doc), 1)
        }
    })
})


addSchema.pre('remove', async function() {
    try {
        const add = this
            // delete current add id from users saved adds 
            // await User.updateMany({ '_id': product.categories }, { $pull: { products: product._id } });

        // const user = await User.findById("61bc33b24991fa89d836781e")
        console.log('inside middleware')
        const user = new User()
        console.log(user)

        // next()

    } catch (e) {
        return e
    }

})



const Add = mongoose.model('Add', addSchema);

module.exports = Add;