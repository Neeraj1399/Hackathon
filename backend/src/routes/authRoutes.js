const express = require('express');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

module.exports = router;
