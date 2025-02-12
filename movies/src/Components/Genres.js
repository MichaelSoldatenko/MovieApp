import { useParams } from "react-router";
import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import genresArr from "../data/genres";
import Error from "./Error";
import { useUser } from "./UserContext";

import "../styles/ListOfMovies.css";

import { useTheme } from "./SwitchTheme";

const MOVIE_API_KEY = process.env.REACT_APP_MOVIE_API_KEY;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${MOVIE_API_KEY}`,
  },
};

export default function Genres() {
  let indexOfFavorites = false;

  const userData = useUser();

  let { genreID } = useParams();

  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [genreMovies, setGenreMovies] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [message, setMessage] = useState("");

  const { theme } = useTheme();

  async function fetchGenre() {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${genreID}&page=${currentPage}&sort_by=${sortBy}`,
        options
      );

      if (response.status >= 400 && response.status < 500) {
        setMessage("Invalid genre ID");
      }

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setGenreMovies(data.results);
        setTotalPages(data.total_pages);
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    } catch (err) {
      setMessage("An error was happened");
    }
  }

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

  function goToFirstPage() {
    setCurrentPage(1);
  }

  function goToNextPage() {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  async function addToFavorites(
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
    vote_count
  ) {
    const token = localStorage.getItem("token");

    let k = 0;

    favoriteMovies.forEach((movie) => {
      if (movie.id === id) {
        k = 1;
      }
    });

    if (k) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/movies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
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
        }),
      });

      if (response.ok) {
        const data = await response.json();
      }
    } catch (err) {}
  }

  useEffect(() => {
    fetchGenre();
  }, [currentPage, sortBy]);

  useEffect(() => {
    async function getFavorites() {
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
          setFavoriteMovies(data);
        }
      } catch (err) {}
    }

    getFavorites();
  }, []);

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

  return (
    <div>
      {message !== "" || genreMovies.length === 0 ? (
        <Error />
      ) : (
        <div>
          <TopBar />

          <h1
            style={{
              position: "absolute",
              top: "25%",
              left: "3.5%",
              color: `${theme === "dark-theme" ? "white" : "black"}`,
            }}
          >
            Best {genresArr.movie_genres_ids[genreID]} movies:
          </h1>

          <select
            name="sorting"
            id="sorting-select"
            className={theme}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option
              value="popularity.desc"
              className={`sorting-option ${theme}`}
              defaultValue
            >
              Popular
            </option>
            <option
              value="release_date.desc"
              className={`sorting-option ${theme}`}
            >
              Release Date
            </option>
            <option
              value="vote_average.desc"
              className={`sorting-option ${theme}`}
            >
              Rating
            </option>
          </select>

          <div className="movie-list-div">
            {genreMovies.map((movie, index) => (
              <div
                key={index}
                className={`movie-div ${theme} ${
                  hoveredIndex === index ? "hovered" : ""
                }`}
                onClick={() => openMoviePage(movie)}
                onMouseEnter={() => setHoveredIndex(index)}
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

                  <div className={`overview-div ${theme}`}>
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

                {favoriteMovies.forEach((item) => {
                  if (item.id === movie.id) {
                    indexOfFavorites = true;
                    return;
                  }
                })}

                {indexOfFavorites ? (
                  <button
                    className={`del-from-favorites-btn ${theme}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFromFavorites(movie.id);
                    }}
                    style={{
                      display: `${userData.message ? "none" : "block"}`,
                    }}
                  ></button>
                ) : (
                  <button
                    className={`add-to-favorites-btn ${theme}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToFavorites(
                        movie.title,
                        movie.id,
                        movie.adult,
                        movie.backdrop_path,
                        movie.genre_ids,
                        movie.original_language,
                        movie.original_title,
                        movie.overview,
                        movie.popularity,
                        movie.poster_path,
                        movie.release_date,
                        movie.video,
                        movie.vote_average,
                        movie.vote_count
                      );
                    }}
                    style={{
                      display: `${userData.message ? "none" : "block"}`,
                    }}
                  ></button>
                )}

                {(indexOfFavorites = false)}

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
              className={`pagination-btns ${theme}`}
              disabled={currentPage === 1}
              onClick={goToFirstPage}
            >
              1
            </button>
            <button
              className={`pagination-btns ${theme}`}
              disabled={currentPage === 1}
              onClick={goToPreviousPage}
            >{`<`}</button>
            <span id="pagination-span" className={theme}>
              {currentPage}/{totalPages}
            </span>
            <button
              className={`pagination-btns ${theme}`}
              disabled={currentPage === totalPages}
              onClick={goToNextPage}
            >{`>`}</button>
          </div>
        </div>
      )}
    </div>
  );
}
