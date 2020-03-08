const path = require('path')
const fs = require('fs');
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
// const morgan = require('morgan');

const app = express()
const port = process.env.PORT || 3000

// // Setup logging in command-line
// app.use(morgan('short'));
// // Write logs to file
// const accessLogStream = fs.createWriteStream('../access.log', {flags: 'a'});
// app.use(morgan('short', {stream: accessLogStream}));

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Ming Hsu'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Ming Hsu'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Enter your location to know the weather!',
        title: 'Help',
        name: 'Ming Hsu'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }
    geocode(req.query.address)
        .then(
            ({latitude, longitude, location}) => forecast(latitude, longitude, location),
            error => res.send({ error: error.message })
        )
        .then(
            ({forecastData, location}) => res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            }),
            error => res.send({ error: error.message })
        )
        .catch(new Function()) // avoid UnhandledPromiseRejectionWarning
})

app.get('/products', (req, res) => {
    // check query string: "search"
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    // http://localhost:3000/products?search=game&rating=5
    // { search: 'game', rating: '5' }
    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Ming Hsu',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Ming Hsu',
        errorMessage: 'Page not found.'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})