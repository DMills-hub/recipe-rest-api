const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const isAuth = require('../middleware/isAuth');

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/account/:userId", isAuth, authController.getAccount);

router.post("/changePassword", isAuth, authController.changePassword);

router.post("/resetPassword", authController.resetPassword);

router.get("/reset/:token", authController.resetPasswordWithToken);

router.post("/reset/:token", isAuth, authController.passwordReset);

module.exports = router;
