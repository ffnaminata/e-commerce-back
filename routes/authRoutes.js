const router = require("express").Router();

const {
  register,
  validateEmail,
  forgotPassword,
  resetPassword,
  login,
} = require("../controllers/authController");

//REGISTER
router.post("/register", register);

//VALIDATE EMAIL
router.get("/validate-email", validateEmail);

//FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

//RESET PASSWORD
router.post("/reset-password", resetPassword);

//LOGIN
router.post("/login", login);


module.exports = router;
