const router = require('express').Router();
const UserControllers = require('../Controllers/User');

router.post('/register', UserControllers.register);
router.post('/user/login', UserControllers.login);
router.get('/user/:id', UserControllers.getById);
router.get('/user/profile', UserControllers.getProfile);

module.exports = router;
