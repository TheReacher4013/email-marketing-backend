const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const {protect} = require('../middleware/authMiddleware');

const{
    register, login, forgotPassword, resetPassword, getMe, logout,
} = require('../controller/authcontroller');

// Use for validation rules

const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({min: 6})
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength().withMessage('password is required'),
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect,getMe);
router.get('/logout', protect, logout);

module.exports = router;