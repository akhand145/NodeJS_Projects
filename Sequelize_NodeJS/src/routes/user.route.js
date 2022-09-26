const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

router.post('/user/search', userController.search);

router.post('/create', userController.create);

router.post('/login', userController.login);

router.get('/logout', userController.logout)

router.get('/getAll', userController.getAll);

router.get('/get/:id', userController.getById);

router.put('/update/:id', userController.updateUser);

router.put('/delete/:id', userController.deleteUser);

router.put('/verify/:id', userController.verifyUser);

router.get('/user/sendOTP', userController.sendOTP);

router.post('/verifyOTP', userController.verifyOTP);

router.put('/forgotPass/:id', userController.forgotPass);

router.put('/resetPass/:id', userController.resetPass);


module.exports = router;
