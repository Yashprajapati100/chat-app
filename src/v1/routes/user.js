const express = require('express');
const UserController = require('../controllers/UserController')
const profileimage=require('../../modules/middleware/multer')
const AuthMiddleware=require('../../modules/middleware/auth')
const uploadMiddleware=require('../../modules/middleware/multer');
const router = express.Router();

router.get('/signup',UserController.signup);
router.post('/signup',profileimage.single('image'),UserController.customsignup);
router.get('/login',UserController.login);
router.post('/login',UserController.customlogin);
router.get('/logout',UserController.logout);

router.get('/dashboard',AuthMiddleware.requireAuth,UserController.dashboard);
router.post('/savechat',AuthMiddleware.requireAuth,uploadMiddleware.single('fileupload'),UserController.saveChat);
router.post('/updatechat',AuthMiddleware.requireAuth,UserController.updateChat);
router.post('/deletechat',AuthMiddleware.requireAuth,UserController.deleteChat);
router.get('/recentchat',AuthMiddleware.requireAuth,UserController.recentChat);

// router.post('/change-password',AuthMiddleware.requireAuth,UserController.changepassword);


module.exports=router;