const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.protect, authController.logout);
// Below /me route is route for a currently logged-in user to see/access his own user data (for e.g. looking at his own profile in fb while he is logged in with his a/c into fb)
router.get("/me", authController.protect, userController.getMe, userController.getUser);

module.exports = router;
