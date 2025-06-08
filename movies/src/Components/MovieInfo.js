import { useParams } from "react-router";
import { useEffect, useState } from "react";
import YouTube from "react-youtube";
import TopBar from "./TopBar";
import Comments from "./Comments";
import months from "../data/months";
import genresArr from "../data/genres";
import "../styles/TopBar.css";
import "../styles/ListOfMovies.css";
import "../styles/MovieInfo.css";
import "../responsive/MovieInfo.css";
import Error from "./Error";

import { useTheme } from "./SwitchTheme";
import { useUser } from "./UserContext";

const MOVIE_API_KEY = process.env.REACT_APP_MOVIE_API_KEY;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${MOVIE_API_KEY}`,
  },
};

export default function MovieInfo() {
  let { movieID } = useParams();

  let indexOfFavorites = false;

  const [movieInfo, setMovieInfo] = useState([]);
  const [movieVideo, setMovieVideo] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [message, setMessage] = useState("");
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const { theme } = useTheme();
  const userData = useUser();

  useEffect(() => {
    fetchMovieInfo();
    fetchMovieVideo();
    fetchSimilarMovies();
  }, []);

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

  async function fetchMovieInfo() {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieID}?language=en-US`,
        options
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setMovieInfo(data);
      }

      if (response.status >= 400 && response.status < 500) {
        setMessage("Invalid movie ID");
      }
    } catch (err) {
      setMessage("Movie wasn't found");
    }
  }

  async function addToFavorites(
    title,
    id,
    adult,
    backdrop_path,
    genres,
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

    const genre_ids = [];

    for (let value of genres) {
      genre_ids.push(value.id);
    }

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
        window.location.reload();
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

  async function fetchMovieVideo() {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieID}/videos?language=en-US`,
        options
      );

      if (response.ok) {
        const data = await response.json();
        setMovieVideo(data.results);
      }
    } catch (err) {
      setMessage("Video wasn't found");
    }
  }

  async function fetchSimilarMovies() {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieID}/similar?language=en`,
        options
      );

      if (response.ok) {
        const data = await response.json();
        setSimilarMovies(data.results);
      }
    } catch (err) {
      setMessage("Movies wasn't found");
    }
  }

  function getReleaseDate(date) {
    const dateArr = date.split("-");
    const month_num = dateArr[1];
    return `${parseInt(dateArr[2])}th of ${months.months_nums[month_num]} ${
      dateArr[0]
    }`;
  }

  function getYear(fullDate) {
    const newDate = fullDate.split("-");
    return newDate[0];
  }

  function getGenre(idArr) {
    const genre = idArr[0];
    return genresArr.movie_genres_ids[genre];
  }

  function getFullGenres(idArr) {
    const genres = [];
    idArr.forEach((id) => {
      genres.push(genresArr.movie_genres_ids[id]);
    });
    return genres.join(", ");
  }

  function openMoviePage(movie) {
    window.location.href = `/${movie.id}`;
  }

  return (
    <div>
      {message !== "" ? (
        <Error />
      ) : (
        <div>
          <TopBar />

          {movieInfo.backdrop_path && (
            <img
              src={`https://image.tmdb.org/t/p/original/${movieInfo.backdrop_path}`}
              alt="movie-background"
              style={{
                width: "100%",
                position: "absolute",
                top: "0%",
                left: "0%",
                zIndex: "1",
                maskImage: "linear-gradient(to bottom, black, transparent)",
              }}
            />
          )}

          <div className={`movie-info-background ${theme}`}>
            <div className="movie-info-block">
              {movieInfo.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movieInfo.poster_path}`}
                  alt="movie-poster"
                  className="movie-poster-small"
                />
              ) : (
                <div
                  style={{
                    height: "50vh",
                  }}
                ></div>
              )}

              <div className="movie-info-block text">
                <h1
                  className={`name-text ${theme}`}
                  style={{
                    display: "inline-block",
                  }}
                >
                  {movieInfo.title}
                </h1>

                {favoriteMovies.forEach((item) => {
                  if (item.id === movieInfo.id) {
                    indexOfFavorites = true;
                    return;
                  }
                })}

                {indexOfFavorites ? (
                  <button
                    className={`movie-info-btn dislike ${theme}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFromFavorites(movieInfo.id);
                    }}
                    style={{
                      display: `${userData.message ? "none" : "block"}`,
                    }}
                  >
                    Dislike
                  </button>
                ) : (
                  <button
                    className={`movie-info-btn like ${theme}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToFavorites(
                        movieInfo.title,
                        movieInfo.id,
                        movieInfo.adult,
                        movieInfo.backdrop_path,
                        movieInfo.genres,
                        movieInfo.original_language,
                        movieInfo.original_title,
                        movieInfo.overview,
                        movieInfo.popularity,
                        movieInfo.poster_path,
                        movieInfo.release_date,
                        movieInfo.video,
                        movieInfo.vote_average,
                        movieInfo.vote_count
                      );
                    }}
                    style={{
                      display: `${userData.message ? "none" : "block"}`,
                    }}
                  >
                    Like
                  </button>
                )}

                {(indexOfFavorites = false)}

                <br />
                <p className={`main-text ${theme}`}>
                  <b>Genres: </b>
                  {movieInfo.genres &&
                    movieInfo.genres.map((genre) => (
                      <a
                        href={`/genres/${genre.id}`}
                        style={{
                          textDecoration: "none",
                          color: "rgb(29, 123, 255)",
                        }}
                        key={genre.id}
                      >
                        {genre.name}{" "}
                      </a>
                    ))}
                </p>
                <br />
                <p className={`main-text ${theme}`}>
                  <b>Countries: </b>
                  {movieInfo.production_countries &&
                    movieInfo.production_countries.map(
                      (country) => country.name + " "
                    )}
                </p>
                <br />
                <p className={`main-text ${theme}`}>
                  <b>Release date: </b>
                  {movieInfo.release_date &&
                    getReleaseDate(movieInfo.release_date)}
                </p>
                <p
                  style={{
                    textAlign: "justify",
                  }}
                  className={`main-text ${theme}`}
                >
                  <b>Overview: </b>
                  {movieInfo.overview}
                </p>
                <p className={`main-text ${theme}`}>
                  <b>Rate: </b>
                  {movieInfo.vote_average && movieInfo.vote_average.toFixed(1)}
                  /10
                </p>
              </div>
            </div>

            {movieVideo.length !== 0 ? (
              <div className="youtube-div">
                <YouTube
                  videoId={movieVideo && movieVideo[0].key}
                  opts={{
                    height: "390",
                    width: "640",
                    playerVars: {
                      rel: 0,
                      hl: "en",
                    },
                  }}
                />
              </div>
            ) : (
              <p
                style={{
                  color: `${theme === "dark-theme" ? "white" : "black"}`,
                  position: "absolute",
                  top: "65%",
                  left: "50%",
                }}
              >
                There is no video available
              </p>
            )}

            <h3
              style={{
                color: `${theme === "dark-theme" ? "white" : "black"}`,
              }}
            >
              Comments:
            </h3>
            <Comments movieID={movieID} user={userData} />

            <h3 className={`similar-movies-h3 ${theme}`}>Similar movies:</h3>

            <div
              className="movie-list-div"
              style={{
                marginTop: "50px",
                paddingBottom: "30px",
              }}
            >
              {similarMovies.map((movie) => (
                <div
                  key={movie.id}
                  className={`movie-div ${theme} ${
                    hoveredIndex === movie.id ? "hovered" : ""
                  }`}
                  onClick={() => openMoviePage(movie)}
                  onMouseEnter={() => setHoveredIndex(movie.id)}
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
          </div>
        </div>
      )}
    </div>
  );
}
