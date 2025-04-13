import genresArr from "../data/genres";
import countries from "../data/countries";
import { useEffect, useState } from "react";
import TopBar from "./TopBar";
import "../styles/ListOfMovies.css";
import "../responsive/ListOfMovies.css";
import "../styles/TopBar.css";
import "../styles/SortBy.css";
import "../responsive/SortBy.css";
import "../styles/Pagination.css";
import { useUser } from "./UserContext";

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

export default function Home() {
  let indexOfFavorites = false;

  const userData = useUser();

  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [movieList, setMovieList] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [yearBegin, setYearBegin] = useState("1920");
  const [yearEnd, setYearEnd] = useState("2025");

  const { theme } = useTheme();

  const years = [];

  function calcYear() {
    let k = 1920;

    while (k <= 2025) {
      years.push(String(k));
      k++;
    }
  }

  calcYear();

  useEffect(() => {
    setIsLoading(true);
    fetch(
      `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${currentPage}&sort_by=${sortBy}&primary_release_date.gte=${yearBegin}-01-01&primary_release_date.lte=${yearEnd}-12-31&with_origin_country=${country}`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
        setMovieList(data.results);
        setTotalPages(data.total_pages);
      });
  }, [currentPage, sortBy, yearBegin, yearEnd, country]);

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

  function goToPreviousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function goToNextPage() {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  }

  function goToFirstPage() {
    setCurrentPage(1);
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
      <TopBar />

      <h1 className={`title-h1 ${theme}`}>Popular Movies & TV Shows</h1>
      <div className="sorting-div">
        <select
          name="sorting"
          id="sorting-select"
          className={`${theme} sorting-select`}
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

        <div className="double">
          <select
            name="year"
            id="year-select"
            className={`${theme} sorting-select`}
            style={{
              position: "static",
            }}
            onChange={(e) => {
              setYearBegin(e.target.value);
              setYearEnd(e.target.value);
            }}
          >
            <option value="">Year</option>
            {years.map((year) => {
              return (
                <option value={year} key={year}>
                  {year}
                </option>
              );
            })}
          </select>

          <select
            name="country"
            id="country-select"
            className={`${theme} sorting-select`}
            style={{
              position: "static",
            }}
            onChange={(e) => {
              console.log(e.target.value);
              setCountry(e.target.value);
            }}
          >
            <option value="">All</option>
            {countries.countries_list.map((country) => {
              return (
                <option value={country.iso_3166_1} key={country.iso_3166_1}>
                  {country.english_name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="movie-list-div">
        {movieList.map((movie, index) => (
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
          onClick={goToFirstPage}
          disabled={currentPage === 1}
          className={`pagination-btns ${theme}`}
        >
          1
        </button>
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`pagination-btns ${theme}`}
        >{`<`}</button>
        <span id="pagination-span" className={theme}>
          {currentPage}/{totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`pagination-btns ${theme}`}
        >{`>`}</button>
      </div>
      <footer className="tmdb-footer">
        <img src="tmdb.svg" alt="tmdb-icon" className="tmdb-icon" />
        <p className={`tmdb-p ${theme}`}>
          This product uses TMDB and the TMDB APIs but is not endorsed,
          certified, or otherwise approved by TMDB.
        </p>
      </footer>
    </div>
  );
}
