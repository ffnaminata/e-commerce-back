const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../verifyToken");

const {
  updatedUser,
  deleteUser,
  getUser,
  getAllUsers,
} = require("../controllers/userController");

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, updatedUser);

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, deleteUser);

//GET USER 
router.get("/find/:id", verifyTokenAndAdmin, getUser);

//GET ALL USER
router.get("/", verifyTokenAndAdmin, getAllUsers);

module.exports = router;
