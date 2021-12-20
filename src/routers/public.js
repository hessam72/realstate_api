const express = require('express')
const router = new express.Router()

const User = require('../models/user')
const Add = require('../models/add')
const Category = require('../models/category')
const Field = require('../models/field')
const City = require('../models/city')




router.get('/', (req, res) => {

    res.render('/index.html', { data: "hiiiiiii" })

})


router.post('/login', async(req, res) => {
    try {

        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
        if (!user) {
            throw new Error('Wrong credentials')
        }
        //create token
        res.send(user)

    } catch (e) {
        res.send('error: ' + e)
    }
})

// create operation
router.post('/singup', async(req, res) => {
    if (!(req.body.fullname && req.body.email &&
            req.body.password && req.body.phone_number)) {
        return res.send('please insert all of required cridentials')
    }
    try {
        const user = new User({
            ...req.body
        })
        await user.save()
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(500).send('error' + e)
    }

})

// read with relations
router.get('/add/:id', async(req, res) => {
    try {
        const id = req.params.id
            //retrive category
            //reterive owner
        const add = await Add.find({ _id: id }).populate('owner').populate('category')

        res.send(add)

    } catch (e) {
        res.send('error: ' + e)
    }
})

//show adds with filters
router.get('/adds', async(req, res) => {
    try {
        const sort = {}

        //creating query with given fields
        let query = {}
        if (req.query.search_text) {
            query = {
                $text: { $search: req.query.search_text },
            }
        }
        req.query.category ? query["category"] = req.query.category : ''
        req.query.owner ? query["owner"] = req.query.owner : ''
        req.query.field_id ? query["fields.field_id"] = req.query.field_id : ''
        req.query.city ? query["city"] = req.query.city : ''

        //only fetch active adds
        query["is_active"] = true


        //sorting
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        // //pagination the results
        const limit = req.query.limit ? parseInt(req.query.limit) : 0
        const skip = req.query.skip ? parseInt(req.query.skip) : 0

        const adds = await Add.find(query)
            .sort(sort)
            .limit(limit)
            .skip(skip)


        res.send(adds)


    } catch (e) {
        res.send(e.toString())
    }
})

//home page lastest adds
router.get('/adds/home', async(req, res) => {
    try {
        //return 6 newst adds
        const adds = await Add.find({}).sort({ 'createdAt': 'desc' }).limit(6)
        res.send(adds)
    } catch (e) {
        res.send(e.toString())
    }
})




//read categories with adds and fields
router.get('/category/:id', async(req, res) => {
    try {
        const id = req.params.id
        const category = await Category.findById(id).populate('fields').populate('adds')
        res.send(category)


    } catch (e) {
        res.send('error' + e)
    }
})






module.exports = router