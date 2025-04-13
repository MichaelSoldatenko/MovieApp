const express = require("express");
const {
  addSearchQuery,
  getSearchHistory,
} = require("../controllers/searchHistoryController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/history", authMiddleware, addSearchQuery);
router.get("/history", authMiddleware, getSearchHistory);

module.exports = router;
