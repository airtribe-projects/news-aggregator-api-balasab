const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/preferences', verifyToken, userController.getPreferences);
router.put('/preferences', verifyToken, userController.updatePreferences);

module.exports = router;
