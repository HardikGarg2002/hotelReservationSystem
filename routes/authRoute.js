const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController')

router.route("/register").post(authController.registerUser);
router.route("/login").post(authController.generateToken);
router.route("/verifyEmail").post(authController.verifyEmail);
router.route("/logout").get(authController.verifyToken,authController.logOut);

module.exports = router;