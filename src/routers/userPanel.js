const mongoose = require('mongoose')
const express = require('express')
const router = new express.Router()
const Auth = require('../middleware/auth')
const User = require('../models/user')
const Add = require('../models/add')
const Category = require('../models/category')
const Field = require('../models/field')
const City = require('../models/city')
const { ValidateUpdateFields } = require('../utils/validation')



//create add
router.post('/add', Auth, async(req, res) => {
    try {
        const add = await new Add({
            ...req.body
        }).save()

        res.send(add)

    } catch (e) {
        res.status(500).send('error' + e)
    }
})

//read user profile with adds
router.get('/user/profile', Auth, async(req, res) => {
    try {

        const user = await req.user.populate('adds')
        res.send(user)

    } catch (e) {
        res.send('error: ' + e)
    }
})


//update user
router.patch('/user/update', Auth, async(req, res) => {
        try {
            const allowUpdates = ['fullname', 'user_id', 'email', 'phone_number', 'password']
            const updates = Object.keys(req.body)
            if (!ValidateUpdateFields(updates, allowUpdates)) {
                return res.status(400).send('invalid update params')
            }
            const user = await User.findById(req.body.user_id)
            updates.forEach((update) => {
                user[update] = req.body[update]
            })
            await user.save()
            if (!user) {
                res.status(404).send('user not found')
            }

            res.status(200).send(user)



        } catch (e) {
            console.log('error: ' + e)
        }
    })
    //update add
router.patch('/add/update', Auth, async(req, res) => {
    try {
        // check if current user is the owner of this add
        const add = await Add.findById(req.body.add_id)
        if (add.owner.toString() != req.body.user_id) {
            return res.send('current user is not the owner of this add')
        }
        //then
        const allowUpdates = ['title', 'user_id', 'add_id', 'description', 'images', 'fields']
        const updates = Object.keys(req.body)
        if (!ValidateUpdateFields(updates, allowUpdates)) {
            return res.status(400).send('invalid update params')
        }
        updates.forEach((update) => {
            add[update] = req.body[update]
        })

        await add.save()
        res.send(add)


    } catch (e) {
        res.send('error: ' + e)
    }
})

//concat delete
router.delete('/user/delete', Auth, async(req, res) => {
    try {
        // await User.deleteOne({ _id: req.body.user_id })
        const user = await User.findById(req.body.user_id)
        user.remove()
        res.send('user deleted!')

    } catch (e) {
        res.send('error: ' + e)
    }
})

module.exports = router