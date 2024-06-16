const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
  const { userId } = req.params;
  let { productId, quantity } = req.body;

  try {
    quantity = parseInt(quantity, 10);

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();

    product.stock -= quantity;
    await product.save();

    res.status(200).json(cart);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Error adding product to cart', details: err });
  }
};

//REMOVE FROM CART
exports.removeFromCart = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }
    cart.products.splice(productIndex, 1);

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error removing product from cart', details: err });
  }
};

//INCREMENT
exports.incrementProductQuantity = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock > 0) {
      cart.products[productIndex].quantity += 1;
      await cart.save();

      product.stock -= 1;
      await product.save();

      res.status(200).json(cart);
    } else {
      res.status(400).json({ error: 'Not enough stock available' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error incrementing product quantity', details: err });
  }
};


//DECREMENT
exports.decrementProductQuantity = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }

    if (cart.products[productIndex].quantity > 1) {
      cart.products[productIndex].quantity -= 1;
      await cart.save();

      const product = await Product.findById(productId);
      if (product) {
        product.stock += 1;
        await product.save();
      }

      res.status(200).json(cart);
    } else {
      cart.products.splice(productIndex, 1);
      await cart.save();

      const product = await Product.findById(productId);
      if (product) {
        product.stock += 1;
        await product.save();
      }

      res.status(200).json(cart);
    }
  } catch (err) {
    res.status(500).json({ error: 'Error decrementing product quantity', details: err });
  }
};

//SUMMARY 
exports.getCartSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId }).populate('products.productId');
    if (!cart || !cart.products) {
        return res.status(404).json({ msg: 'Cart not found' });
    }

    const total_price = cart.products.reduce((acc, item) => {
        if (item.productId && item.productId.price) {
            return acc + item.quantity * item.productId.price;
        } else {
            return acc;
        }
    }, 0);

    const nbr_product = cart.products.reduce((acc, item) => acc + item.quantity, 0);

    res.json({ total_price, nbr_product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

//DELETE
exports.deleteCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET USER CART
exports.getUserCart =  async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('products.productId');
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET ALL
exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
};
