const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: {
      type: [{ type: String }],
      required: true
    },
    // categories: {
    //   type : [
    //     { 
    //       type: mongoose.Schema.Types.ObjectId, 
    //       ref: 'Category', 
    //       required: false 
    //     }
    //   ]
    // }, 
    size: { type: String, default: "standard" },
    color: { type: String, default: "neutre" },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    likes: {
      type: [
        { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: "User" 
        }],
      default: [],
    }
  },
  { timestamps: true }
);

ProductSchema.methods.getLikesCount = function() {
  return this.likes.length;
};

module.exports = mongoose.model("Product", ProductSchema);

