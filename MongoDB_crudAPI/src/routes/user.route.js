const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

// Signup a new user
router.post('/', userController.create);

// Login an existing user
router.post('/login', userController.login);

// logout an existing user
router.put('/logout', userController.logout);

// Retrieve all users
router.get('/', userController.findAll);

// Retrieve a single user with id
router.get('/:id', userController.findOne);

// Update a user with id
router.put('/:id', userController.update);

// Delete a user with id
router.delete('/:id', userController.delete);

// IsVerified by Admin
router.put('/verify/:id', userController.verify);

// sendOTP by nodeMailer and twilio
router.put('/sendOTP/:id', userController.sendOTP);

// verifyOTP
router.put('/verifyOTP/:id', userController.verifyOTP);

// forgot Password
router.put('/forgotPass/:id', userController.forgotPass);

// reset Password
router.put('/resetPass/:id', userController.resetPass);


module.exports = router;
