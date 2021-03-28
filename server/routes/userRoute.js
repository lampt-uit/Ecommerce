const router = require('express').Router();
const userCrl = require('../controllers/userCtrl');

router.post('/register', userCrl.register);
router.get('/refresh_token', userCrl.refreshToken);

module.exports = router;
