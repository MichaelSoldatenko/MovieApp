const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  id: { type: Number, required: true },
  adult: { type: Boolean },
  backdrop_path: { type: String },
  genre_ids: { type: [Number] },
  original_language: { type: String },
  original_title: { type: String },
  overview: { type: String },
  popularity: { type: Number },
  poster_path: { type: String },
  release_date: { type: String },
  video: { type: Boolean },
  vote_average: { type: Number },
  vote_count: { type: Number },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Movie", movieSchema);
