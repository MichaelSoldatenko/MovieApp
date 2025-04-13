const SearchHistory = require("../models/SearchHistory");

const addSearchQuery = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: "query is required" });
    }

    const newSearch = new SearchHistory({ userId, query });
    await newSearch.save();

    res.status(201).json({ message: "Request is saved", newSearch });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getSearchHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const history = await SearchHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  addSearchQuery,
  getSearchHistory,
};
