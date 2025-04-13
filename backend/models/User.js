const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  avatar: {
    type: String,
    default: "avatar-placeholder.png",
  },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  about: { type: String, default: "" },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("User", UserSchema);
