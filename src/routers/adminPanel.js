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

router.post('/users/manage', isAdmin, async(req, res) => {
    try {
        //manage users



    } catch (e) {
        res.send(e.toString())
    }
})




module.exports = router