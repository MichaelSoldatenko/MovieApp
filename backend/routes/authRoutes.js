const express = require("express");
const {
  register,
  login,
  getUser,
  getAvatar,
  uploadAvatar,
  deleteUser,
  updateUserInfo,
  updateAbout,
  resetPassword,
  forgotPassword,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/avatarMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", authMiddleware, getUser);
router.get("/user/avatar", authMiddleware, getAvatar);
router.post(
  "/user/avatar",
  authMiddleware,
  upload.single("avatar"),
  uploadAvatar
);
router.delete("/user/delete", authMiddleware, deleteUser);
router.patch("/user/info", authMiddleware, updateUserInfo);
router.patch("/user/about", authMiddleware, updateAbout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
