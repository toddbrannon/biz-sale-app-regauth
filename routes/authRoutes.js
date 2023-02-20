const { Router } = require('express');
const authController = require('../controllers/authController');
const flash = require('express-flash')
const session = require("express-session")

const router = Router();

var MemoryStore = require('memorystore')(session)

router.use(session({
    saveUninitialized:false,
    cookie:{maxAge:86400000},
    store: new MemoryStore({
        checkPeriod:8640000 //prune expired entries every 24h
    }),
    resave: false,
    secret: 'keyboard cat'
}))

router.use(flash())

router.get('/', authController.index_get);
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/register-free', authController.register_free_get);
router.post('/register-free', authController.register_free_post);
router.get('/register-premium', authController.register_premium_get);
router.post('/register-premium', authController.register_premium_post);
router.get('/register-pro', authController.register_pro_get);
router.post('/register-pro', authController.register_pro_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
router.get('/forgot-password', authController.fp_get);
router.get('/reset-password', authController.rp_get);

module.exports = router;