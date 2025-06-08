const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { default: mongoose } = require("mongoose");
const Comment = require("../models/Comment");

const register = async (req, res) => {
  const { userName, email, password, gender } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }
    const user = new User({ userName, email, password, gender });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err });
  }
};

const login = async (req, res) => {
  const { userName, password, remember } = req.body;

  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, "your_jwt_secret", {
      expiresIn: `${remember ? "7d" : "1h"}`,
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      userName: user.userName,
      email: user.email,
      gender: user.gender,
      about: user.about,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const avatarFile = user.avatar || "avatar-placeholder.png";

    const avatarPath = path.resolve(
      __dirname,
      avatarFile.startsWith("..")
        ? avatarFile
        : `../uploads/avatars/${avatarFile}`
    );

    if (!fs.existsSync(avatarPath)) {
      return res.status(404).json({ message: "Avatar file not found" });
    }

    res.sendFile(avatarPath);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.avatar && user.avatar !== "avatar-placeholder.png") {
      const oldAvatarPath = path.resolve(
        __dirname,
        "../uploads/avatars",
        user.avatar
      );
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    user.avatar = req.file.filename;
    await user.save();

    res.json({ message: "Avatar updated successfully", avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Comment.deleteMany({ userId: user._id });

    if (user.avatar && user.avatar !== "avatar-placeholder.png") {
      const avatarPath = path.resolve(
        __dirname,
        "../uploads/avatars",
        user.avatar
      );
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    await User.findByIdAndDelete(req.user.userId);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserInfo = async (req, res) => {
  const { currentPassword, newPassword, userName } = req.body;

  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect current password" });
      }
    }

    if (userName) {
      user.userName = userName;
    }

    if (newPassword) {
      user.password = newPassword;
    }

    await user.save();

    res.json({ message: "User information updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateAbout = async (req, res) => {
  const { about } = req.body;

  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.about = about;
    await user.save();

    res.json({
      message: "About information updated successfully",
      about: user.about,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetLink = `https://movie-app-psi-inky.vercel.app/resetPassword/${resetToken}`; //`https://movie-app-psi-inky.vercel.app/resetPassword/${resetToken}`  `http://localhost:3000/resetPassword/${resetToken}`

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 600000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "movie.app.no.reply@gmail.com",
        pass: "hawl xrij qidm pedv",
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    res.json({ message: "Password reset email sent." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

module.exports = {
  register,
  login,
  getUser,
  getAvatar,
  uploadAvatar,
  deleteUser,
  updateUserInfo,
  updateAbout,
  forgotPassword,
  resetPassword,
};
