const express = require('express')
require('./db/mongoose')
const publicRoutes = require('./routers/public')
const adminRoutes = require('./routers/adminPanel')
const userRoutes = require('./routers/userPanel')
    // const taskRoutes = require('./routers/task')
    // const taskRoutes = require('./routers/task')

const app = express()

app.use(express.json())
app.use(publicRoutes)
app.use(adminRoutes)
app.use(userRoutes)

// app.use(taskRoutes)

// we use this file to run our project on test environment which dose not need listen

module.exports = app