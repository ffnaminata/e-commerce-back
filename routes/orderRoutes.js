const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../verifyToken");

const {
  createOrder,
  updateOrder, 
  deleteOrder,
  getUserOrders,
  getAllOrders,
  getMonthlyIncome,
  getPopularProducts,
  getMonthlyOrderCount,
} = require("../controllers/orderController");

// CREATE
router.post("/", verifyToken, createOrder);

// UPDATE
router.put("/:id", verifyTokenAndAdmin, updateOrder);

// DELETE
router.delete("/:id", verifyTokenAndAdmin, deleteOrder);

// GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, getUserOrders);

// GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, getAllOrders);

// GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, getMonthlyIncome);

// GET POPULAR PRODUCTS OF THE MONTH
router.get("/popular-products", verifyTokenAndAdmin, getPopularProducts);

// GET MONTHLY ORDER COUNT
router.get("/monthly-order-count", verifyTokenAndAdmin, getMonthlyOrderCount);

module.exports = router;
