import TopBar from "./TopBar";
import { useEffect, useState } from "react";
import "../styles/ListOfMovies.css";
import { useTheme } from "./SwitchTheme";
import genresArr from "../data/genres";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Favorites() {
  const [movieData, setMovieData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("popularity.desc");

  const { theme } = useTheme();

  async function fetchFavoritesMovies() {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BACKEND_URL}/api/movies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMovieData(data);
      }
    } catch (err) {}
  }

  useEffect(() => {
    fetchFavoritesMovies();
  }, []);

  function getYear(fullDate) {
    const newDate = fullDate.split("-");
    return newDate[0];
  }

  function getGenre(idArr) {
    const genre = idArr[0];
    return genresArr.movie_genres_ids[genre];
  }

  function openMoviePage(movie) {
    window.location.href = `/${movie.id}`;
  }

  function getFullGenres(idArr) {
    const genres = [];
    idArr.forEach((id) => {
      genres.push(genresArr.movie_genres_ids[id]);
    });
    return genres.join(", ");
  }

  function goToPreviousPage(page) {
    if (page > 1) {
      setCurrentPage(page - 1);
    }
  }

  function goToNextPage(page) {
    if (page < totalPages) {
      setCurrentPage(page + 1);
    }
  }

  function goToFirstPage() {
    setCurrentPage(1);
  }

  async function deleteFromFavorites(id) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BACKEND_URL}/api/movies/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (err) {}
  }

  function sortMovies(movies, sorting) {
    return [...movies].sort((a, b) => {
      if (sorting === "popularity.desc") {
        return a.popularity - b.popularity;
      }
      if (sorting === "vote_average.desc") {
        return b.vote_average - a.vote_average;
      }
      if (sorting === "release_date.desc") {
        return new Date(b.release_date) - new Date(a.release_date);
      }

      return 0;
    });
  }

  const sortedMovies = sortMovies(movieData, sortBy);

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = sortedMovies.slice(indexOfFirstMovie, indexOfLastMovie);

  function handleSortBy(e) {
    setSortBy(e.target.value);
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(sortedMovies.length / moviesPerPage);

  return (
    <div>
      <TopBar />

      <h1 className={`title-h1 ${theme}`}>Your Liked Movies & TV Shows</h1>

      <select
        name="sorting"
        id="sorting-select"
        className={theme}
        value={sortBy}
        onChange={handleSortBy}
      >
        <option value="popularity.desc" className={`sorting-option ${theme}`}>
          Popular
        </option>
        <option value="release_date.desc" className={`sorting-option ${theme}`}>
          Release Date
        </option>
        <option value="vote_average.desc" className={`sorting-option ${theme}`}>
          Rating
        </option>
      </select>

      <div className="movie-list-div">
        {currentMovies.map((movie, index) => (
          <div
            key={index}
            className={`movie-div ${theme} ${
              hoveredIndex === index ? "hovered" : ""
            }`}
            onMouseEnter={() => setHoveredIndex(index)}
            onClick={() => openMoviePage(movie)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <button className={`info-btn ${theme}`}></button>

            <div className={`info-window ${theme}`}>
              <h1 id="rate-h1" className={theme}>
                Rate: {movie.vote_average.toFixed(1)}/10
              </h1>

              <p className={`info-window-p ${theme}`}>
                <b>Original title:</b> {movie.original_title}
              </p>

              <p className={`info-window-p ${theme}`}>
                <b>Genres:</b> {getFullGenres(movie.genre_ids)}
              </p>

              <h2 id="overview-h1" className={theme}>
                Overview
              </h2>

              <div className="overview-div">
                <p
                  className={`info-window-p ${theme}`}
                  style={{
                    textAlign: "justify",
                  }}
                >
                  {movie.overview}
                </p>
              </div>
            </div>

            <button
              className={`del-from-favorites-btn ${theme}`}
              onClick={(e) => {
                e.stopPropagation();
                deleteFromFavorites(movie.id);
              }}
            ></button>

            {movie.poster_path && (
              <img
                className="movie-poster"
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                alt="movie-poster"
              />
            )}
            <h4 className={`movie-title ${theme}`}>{movie.title}</h4>
            <p className={`movie-genre-year ${theme}`}>{`${getYear(
              movie.release_date
            )}, ${getGenre(movie.genre_ids)}`}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={goToFirstPage}
          disabled={currentPage === 1}
          className={`pagination-btns ${theme}`}
        >
          1
        </button>
        <button
          onClick={() => goToPreviousPage(currentPage)}
          disabled={currentPage === 1}
          className={`pagination-btns ${theme}`}
        >{`<`}</button>
        <span id="pagination-span" className={theme}>
          {currentPage}/{totalPages}
        </span>
        <button
          onClick={() => goToNextPage(currentPage)}
          disabled={currentPage === totalPages}
          className={`pagination-btns ${theme}`}
        >{`>`}</button>
      </div>
    </div>
  );
}
