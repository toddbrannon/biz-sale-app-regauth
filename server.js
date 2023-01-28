const express = require("express")
const bcrypt = require("bcrypt") // Importing bcrypt package
const passport = require("passport")
const initializePassport = require("./passport-config.js")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require("method-override")
const bodyParser = require('body-parser')

require('dotenv').config();
// require('./src/connect/mongodb');

const port = 8888;

var MemoryStore = require('memorystore')(session)

const app = express()

app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // We wont resave the session variable if nothing is changed
    saveUninitialized: false
}))
app.use(passport.initialize()) 
app.use(passport.session())
app.use(methodOverride("_method"))

app.use(session({
    saveUninitialized:false,
    cookie:{maxAge:86400000},
    store: new MemoryStore({
        checkPeriod:8640000 //prune expired entries every 24h
    }),
    resave: false,
    secret: 'keyboard cat'
}))

app.use('/webhook', bodyParser.raw({ type:'application/json' }))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static('public'))
app.engine('html', require('ejs').renderFile)

app.get('/', (req,res)=>{
    // res.render('index.ejs', {plans});
    res.redirect('http://localhost:3000')
})

app.get('/login', (req,res)=>{
    // res.render('index.ejs', {plans});
    res.render('login.ejs')
})

app.get('/register', (req,res)=>{
    // res.render('index.ejs', {plans});
    res.render('register.ejs')
})

app.get('/register_free', (req,res)=>{
    // res.render('index.ejs', {plans});
    res.render('register_free.ejs')
})

app.get('/register_pro', (req,res)=>{
    // res.render('index.ejs', {plans});
    res.render('register_pro.ejs')
})

app.get('/register_premium', (req,res)=>{
    // res.render('index.ejs', {plans});
    res.render('register_premium.ejs')
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Listen on port
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

