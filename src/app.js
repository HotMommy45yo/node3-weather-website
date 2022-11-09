const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const { env } = require('process')

console.log(__dirname)
console.log(path.join(__dirname, '../public'))

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebar engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res)=>{
    res.render('index',{
        title:'Weather',
        name: 'Szymon Gawlowski'
    })
})

app.get('/about',(req, res)=>{
    res.render('about',{
        title:'About me',
        name: 'Szymon Gawlowski'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        title:'Help',
        helpText: 'helpful text',
        name: 'Szymon Gawlowski'

    })
})

app.get('/weather',(req, res)=>{
    if(!req.query.address){
        return res.send({
            error:'You must provide an adress!'
        })
    }
    geocode(req.query.address,(error, {latitude, longitude, location}={})=>{
        if(error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error){
                return res.send({error})
            }
            res.send({
                forecast:forecastData,
                location,
                address:req.query.address
            })
          })
    })
})

app.get('/products', (req, res)=>{
    if (!req.query.search){
       return res.send({
            error: 'You mnust provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help*',(req, res)=>{
    res.render('404',{
        error: 'Help article not found',
        title:'404',
        name: 'Szymon Gawlowski'
    })
})

app.get('*',(req, res)=>{
    res.render('404',{
        error: 'page not found',
        title:'404'
    })
})

app.listen(port, ()=>{
    console.log('Server is up on port ' + port)
})