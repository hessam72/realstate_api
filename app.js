const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const hbs = require('hbs')
const routes = require('./routes/route.js');

require('./routes/route.js')(app);



const publicDirectoryPath = path.join(__dirname, '/public')
const viewsPath = path.join(__dirname, '/templates/views')
const partialsPath = path.join(__dirname, '/templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)




app.listen(port, () => {
    console.log(` listening at http://localhost:${port}`)
})