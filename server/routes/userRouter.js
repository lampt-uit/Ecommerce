const router = require('express').Router();
const userCrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');

router.post('/register', userCrl.register);
router.post('/login', userCrl.login);
router.get('/logout', userCrl.logout);
router.get('/refresh_token', userCrl.refreshToken);
router.get('/info', auth, userCrl.getUser);
router.patch('/addcart', auth, userCrl.addCart);

module.exports = router;
