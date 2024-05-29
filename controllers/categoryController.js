const CategoryModel = require("../models/Category");


//CREATE
exports.createCategory = async (req, res) => {
  const newCategory = new CategoryModel(req.body);

  try {
    const savedCategory = await newCategory.save();
    res.status(200).json(savedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
};

//UPDATE
exports.updateCategory = async (req, res) => {
  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
};

//DELETE
exports.deleteCategory = async (req, res) => {
  try {
    await CategoryModel.findByIdAndDelete(req.params.id);
    res.status(200).json("Category has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET CATEGORY
exports.getCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
};


//GET ALL CATEGORIES
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json(err);
    }
};