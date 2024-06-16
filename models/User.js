const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, default: '' },
    lastname: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },
    isValidated: { type: Boolean, default: false },
    validationToken: { type: String },
    address: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);