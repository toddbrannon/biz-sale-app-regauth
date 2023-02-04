const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.get('/', authController.index_get);
router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
router.get('/forgot-password', authController.fp_get);
router.get('/reset-password', authController.rp_get);

module.exports = router;