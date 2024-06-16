const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

const {
  createOrder,
  updateOrder, 
  deleteOrder,
  getOrderById,
  getUserOrders,
  getAllOrders,
  getMonthlyIncome,
  getPopularProducts,
  getMonthlyOrderCount,
  getTotalIncome,
  getTotalOrderCount
} = require("../controllers/orderController");

// CREATE
router.post("/", verifyToken, createOrder);

// UPDATE
router.put("/:id", verifyTokenAndAdmin, updateOrder);

// DELETE
router.delete("/:id", verifyTokenAndAdmin, deleteOrder);

// GET ORDER BY ID
router.get("/:id", verifyTokenAndAuthorization, getOrderById);

// GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, getUserOrders);

// GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, getAllOrders);

// GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, getTotalIncome);

// GET POPULAR PRODUCTS OF THE MONTH
router.get("/popular-products", verifyTokenAndAdmin, getPopularProducts);

// GET MONTHLY ORDER COUNT
router.get("/order-count", verifyTokenAndAdmin, getTotalOrderCount);

module.exports = router;
