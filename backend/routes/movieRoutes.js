const express = require("express");

const {
  addMovie,
  getUserMovies,
  deleteMovie,
} = require("../controllers/moviesController");

const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/movies", authMiddleware, addMovie);

router.get("/movies", authMiddleware, getUserMovies);

router.delete("/movies/:id", authMiddleware, deleteMovie);

module.exports = router;
