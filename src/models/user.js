const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Add = require('./add')

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,

    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('must be email!')
            }
        }
    },
    phone_number: {
        type: Number,
        unique: true,
        required: true
    },
    password: {
        required: true,
        type: String,
        trim: true,
        validate(value) {
            if (value.length < 6 || value.toLowerCase() === "password") {
                throw new Error(`pass isn't valid`)
            }
        }
    },
    is_admin: {
        type: Number,
        default: 0
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],

}, {
    timestamps: true,
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals

}, );


userSchema.virtual('adds', {
    ref: 'Add',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.pre('remove', async function(next) {
    const user = this
    console.log(user)
    const adds = await Add.deleteMany({ owner: user._id })
    console.log(adds)
        // dont know why next() throw error
    next()
})

userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})


userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.AUTH_KEY)

    user.tokens = user.tokens.concat({ token })

    await user.save()


    return token
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('unable.. to login')
    }
    return user

}


const User = mongoose.model('User', userSchema);

module.exports = User;