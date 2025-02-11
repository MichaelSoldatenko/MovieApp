const Movie = require("../models/Movie");

const addMovie = async (req, res) => {
  const {
    title,
    id,
    adult,
    backdrop_path,
    genre_ids,
    original_language,
    original_title,
    overview,
    popularity,
    poster_path,
    release_date,
    video,
    vote_average,
    vote_count,
  } = req.body;

  const userId = req.user.userId;

  try {
    const movie = new Movie({
      title,
      id,
      adult,
      backdrop_path,
      genre_ids,
      original_language,
      original_title,
      overview,
      popularity,
      poster_path,
      release_date,
      video,
      vote_average,
      vote_count,
      userId,
    });
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ message: "Error adding movie", error: err });
  }
};

const getUserMovies = async (req, res) => {
  const userId = req.user.userId;

  try {
    const movies = await Movie.find({ userId });
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving movies", error: err });
  }
};

const deleteMovie = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const movie = await Movie.findOne({ id, userId });

    if (!movie) {
      return res
        .status(404)
        .json({ message: "Movie not found or you are not authorized" });
    }

    await movie.deleteOne();
    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting movie", error: err });
  }
};

module.exports = {
  addMovie,
  getUserMovies,
  deleteMovie,
};
