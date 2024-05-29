const Product = require("../models/Product");

//CREATE
exports.createProduct = async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
};

//UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
};

//DELETE
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET PRODUCT
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  const qCategory = req.query.category;
  try {
    let products;

    if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

//LIKE PRODUCT
exports.likeProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (!product.likes.includes(req.params.userId)) {
      product.likes.push(req.params.userId);
      await product.save();
      res.status(200).json({ message: "Product liked successfully" });
    } else {
      res.status(400).json({ message: "User already liked this product" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//DISLIKE PRODUCT
exports.dislikeProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const index = product.likes.indexOf(req.params.userId);
    if (index > -1) {
      product.likes.splice(index, 1);
      await product.save();
      res.status(200).json({ message: "Product disliked successfully" });
    } else {
      res.status(400).json({ message: "User has not liked this product" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//GET LIKES COUNT
exports.getLikesCount = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const likesCount = product.getLikesCount();
    res.status(200).json({ likes: likesCount });
  } catch (err) {
    res.status(500).json(err);
  }
};