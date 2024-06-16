const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

const {
  addToCart,
  removeFromCart,
  decrementProductQuantity,
  incrementProductQuantity,
  getCartSummary,
  deleteCart,
  getUserCart,
  getAllCarts,
} = require("../controllers/cartController");


//ADD TO CART 
router.put('/:userId', addToCart);

//REMOVE FROM CART
router.delete('/:userId/:productId', verifyTokenAndAuthorization, removeFromCart);

//INCREMENT
router.patch('/:userId/:productId/increment', incrementProductQuantity);

//DECREMENT 
router.patch('/:userId/:productId/decrement', decrementProductQuantity);

//SUMMARY
router.get('/:userId', verifyTokenAndAuthorization, getCartSummary);

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, deleteCart);

//GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, getUserCart);

//GET ALL
router.get("/", verifyTokenAndAdmin, getAllCarts);

module.exports = router;
