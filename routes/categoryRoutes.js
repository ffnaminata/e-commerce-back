const router = require("express").Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");

const {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategories,
} = require("../controllers/categoryController");

// CREATE
router.post("/", verifyTokenAndAdmin, createCategory);

// UPDATE
router.put("/:id", verifyTokenAndAdmin, updateCategory);

// DELETE
router.delete("/:id", verifyTokenAndAdmin, deleteCategory);

// GET CATEGORY
router.get("/find/:id", getCategory);

// GET ALL CATEGORIES
router.get("/", getAllCategories);

module.exports = router;
