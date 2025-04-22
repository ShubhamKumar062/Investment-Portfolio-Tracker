const express = require('express');
const { signup, login, forgotPassword, resetPassword } = require('../controllers/authController.js');
const { signUpValidation, loginValidation } = require('../middlewares/authValidations.js');
const router = express.Router();


router.post('/signup',signUpValidation, signup )
router.post('/login',loginValidation, login)
router.post('/forgotpassword', forgotPassword)
router.post('/resetpassword/:token', resetPassword)

module.exports = router;