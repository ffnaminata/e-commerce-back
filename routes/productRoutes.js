const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  likeProduct,
  dislikeProduct,
  getLikesCount,
} = require("../controllers/productController")

//CREATE
router.post("/", verifyTokenAndAdmin, createProduct);

//UPDATE
router.put("/:id", verifyTokenAndAdmin, updateProduct);

//DELETE
router.delete("/:id", verifyTokenAndAdmin, deleteProduct);

//GET PRODUCT
router.get("/find/:id", getProduct);

//GET ALL PRODUCTS
router.get("/", getAllProducts);

//LIKE PRODUCT
router.put("/:productId/like/:userId", verifyToken, likeProduct);

//DISLIKE PRODUCT
router.delete("/:productId/like/:userId", verifyToken, dislikeProduct);

//GET LIKES COUNT 
router.get("/:id/likes", getLikesCount);

module.exports = router;
