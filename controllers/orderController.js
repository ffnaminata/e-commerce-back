const Order = require("../models/Order");

// CREATE
exports.createOrder = async (req, res) => {
  const newOrder = new Order(req.body);
  console.log(newOrder);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
};

// UPDATE
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET ORDER BY ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
};


// GET USER ORDERS
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET ALL ORDERS
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET POPULAR PRODUCTS OF THE MONTH
exports.getPopularProducts = async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));

  try {
    const popularProducts = await Order.aggregate([
      { $match: { createdAt: { $gte: lastMonth } } },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productId",
          total: { $sum: "$products.quantity" },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ]);
    res.status(200).json(popularProducts);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET MONTHLY INCOME
exports.getMonthlyIncome = async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET MONTHLY ORDER COUNT
exports.getMonthlyOrderCount = async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const orderCount = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          totalOrders: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(orderCount);
  } catch (err) {
    res.status(500).json(err);
  }
};

//GET TOTAL INCOME
exports.getTotalIncome = async (req, res) => {
  try {
    const totalIncome = await Order.aggregate([
      {
        $group: {
          _id: null, // Utilisation de null pour grouper tous les documents
          total: { $sum: "$amount" }
        }
      }
    ]);

    // Pour obtenir un seul chiffre au lieu d'un tableau avec un document
    const total = totalIncome.length > 0 ? totalIncome[0].total : 0;
    res.status(200).json({ totalIncome: total });
  } catch (err) {
    res.status(500).json({ message: "An error occurred while fetching the total income", error: err });
  }
};

//GET TOTAL ORDER COUNT
exports.getTotalOrderCount = async (req, res) => {
  try {
    const totalOrderCount = await Order.countDocuments();

    res.status(200).json({ totalOrderCount });
  } catch (err) {
    res.status(500).json({ message: "An error occurred while fetching the total order count", error: err });
  }
};
