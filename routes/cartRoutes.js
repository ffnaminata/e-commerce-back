const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../verifyToken");

const {
  createCart,
  updatedCart,
  deleteCart,
  getUserCart,
  getAllCarts,
} = require("../controllers/cartController");


//CREATE
router.post("/", verifyToken, createCart);

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, updatedCart);

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, deleteCart);

//DELETE A PRODUCT OF CART 

//GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, getUserCart);

//GET ALL
router.get("/", verifyTokenAndAdmin, getAllCarts);

module.exports = router;
