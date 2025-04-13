const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createComment,
  getCommentsByMovie,
  updateComment,
  deleteComment,
} = require("../controllers/commentsController");

const router = express.Router();

router.post("/", authMiddleware, createComment);
router.get("/:movieId", getCommentsByMovie);
router.put("/:id", authMiddleware, updateComment);
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;
