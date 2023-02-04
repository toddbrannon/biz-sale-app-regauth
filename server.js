const express = require("express")
const bcrypt = require("bcrypt") // Importing bcrypt package
const passport = require("passport")
const initializePassport = require("./passport-config.js")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require("method-override")
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
// const { requireAuth, checkUser } = require('./middleware/authMiddleware');

require('dotenv').config();

const port = process.env.PORT || 8888;

var MemoryStore = require('memorystore')(session)

const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')
// app.engine('html', require('ejs').renderFile)

// ==========================================================================

// database connection
// const dbURI = process.env.MONGODB_CONN
const dbURI = "mongodb+srv://toddb:70dd8r%40nn0n%21@trusponse.ugdwe.mongodb.net/user_db?retryWrites=true&w=majority"
mongoose.connect(dbURI)
    .then(() => console.log('connected to mongodb'))
    .then((result) => app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    }))
    .catch(err => console.log(err)
);



// app.get("*", checkUser);
// app.get('/protected', requireAuth, (req, res) => res.render('protected'));
app.use(authRoutes);app.use(authRoutes);

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

// app.get('/', (req,res)=>{
//     // res.render('index.ejs', {plans});
//     // res.redirect('http://localhost:3000')
//     res.send("Root Route for Auth Service")
// })

// app.get('/login', (req,res)=>{
//     // res.render('index.ejs', {plans});
//     res.render('login.ejs')
// })

// // =====================  PASSWORD PROTECTED ROUTE (TEST)  =============================================
// // app.get('/protected', requireAuth, (req, res) => res.send('Protected Route - Requires User Auth'));
// // =====================================================================================================

// app.get('/register', (req,res)=>{
//     // res.render('index.ejs', {plans});
//     res.render('register.ejs')
// })

// app.get('/register_free', (req,res)=>{
//     // res.render('index.ejs', {plans});
//     res.render('register_free.ejs')
// })

// app.get('/register_pro', (req,res)=>{
//     // res.render('index.ejs', {plans});
//     res.render('register_pro.ejs')
// })

// app.get('/register_premium', (req,res)=>{
//     // res.render('index.ejs', {plans});
//     res.render('register_premium.ejs')
// })

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Listen on port - MOVED TO DB CONNECTION LINE 24 2/4/2023 //////
// app.listen(port, () => {
//     console.log(`App listening on port ${port}`);
// });

