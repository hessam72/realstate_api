const app = require('./app')
    // we edit package.json to read dev.env variabels on development

const port = process.env.PORT

app.listen(port, () => {
    console.log('server running at port: ' + port)
})