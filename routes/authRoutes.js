const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../verifyToken");

const {
  register,
  validateEmail,
  login,
} = require("../controllers/authController");

//REGISTER
router.post("/register", register);

//VALIDATE EMAIL
router.get('/validate-email', validateEmail);

//LOGIN
router.post('/login', login);

module.exports = router;
