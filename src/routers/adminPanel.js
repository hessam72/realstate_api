const mongoose = require('mongoose')
const express = require('express')
const router = new express.Router()
const Auth = require('../middleware/auth')
const isAdmin = require('../middleware/is_admin')
const User = require('../models/user')
const Add = require('../models/add')
const Category = require('../models/category')
const Field = require('../models/field')
const City = require('../models/city')


router.post('/city', isAdmin, async(req, res) => {
    try {
        const city = await new City({
            name: req.body.name
        }).save()
        res.send(city)

    } catch (e) {
        res.status(500).send('error' + e)
    }
})
router.post('/category', isAdmin, async(req, res) => {
    try {
        const cat = await new Category({
            ...req.body
        }).save()
        res.send(cat)
    } catch (e) {
        res.status(500).send('error' + e)
    }
})

router.post('/field', isAdmin, async(req, res) => {

    // ypu have to have the table before using transiction for it to work
    //  otherwise mongodb wont create it for you


    const session = await mongoose.startSession();
    // loop trough array and save each ones

    session.startTransaction();
    try {
        for (const data of req.body) {
            try {
                console.log(data)
                await Field.create([{
                    ...data
                }], { session: session })


            } catch (e) {
                console.log(e)
                throw new Error(e)
                    // await session.abortTransaction();
                    // session.endSession();
                    // return res.status(500).send('error' + e)
            }
        }
        console.log('loop done')
        await session.commitTransaction();
        session.endSession();
        res.send('fields saved successfully')
    } catch (e) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).send(e.toString())
    }




})

router.post('/user/manage', isAdmin, async(req, res) => {
    try {
        //determine that user should be activate or deactive
        const is_active = req.body.is_active ? true : false
        console.log(is_active)

        //deActive a user
        const target_user_id = req.body.user_id
            // ban user
        const a = await User.updateOne({ _id: target_user_id }, { is_active })
            //deactive their adds
        const b = await Add.updateMany({ owner: target_user_id }, { is_active })
        console.log(a)
            // console.log(b)

        res.send('user and their adds updated successfully')

    } catch (e) {
        res.send(e.toString())
    }
})
router.post('/add/manage', isAdmin, async(req, res) => {
    try {
        const { add_id } = req.body
        const is_active = req.body.is_active ? true : false

        const a = await Add.updateOne({ _id: add_id }, { is_active })
        console.log(a)
        res.send('add edited successfully')

    } catch (e) {
        res.send(e.toString())
    }
})




module.exports = router