const express = require("express")
const bcrypt = require("bcrypt") // Importing bcrypt package
const passport = require("passport")
const initializePassport = require("./passport-config.js")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require("method-override")
const bodyParser = require('body-parser')
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
// const { requireAuth, checkUser } = require('./middleware/authMiddleware');

// mongodb
require('./config/db')

require('dotenv').config();

const port = process.env.PORT || 5000;

var MemoryStore = require('memorystore')(session)

const app = express()

//middleware
app.use(express.static('public'))
app.use(express.json())

//view engine
app.set('view engine', 'ejs')
// app.engine('html', require('ejs').renderFile)
// ==========================================================================
// app.get("*", checkUser);
// app.get('/protected', requireAuth, (req, res) => res.render('protected'));
// ===========================================================================

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

app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// routes
app.get('/', (req, res) => res.render('index'));
app.use(authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Listen on port - MOVED TO DB CONNECTION LINE 24 2/4/2023 //////
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});



