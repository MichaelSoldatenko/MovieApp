import { useEffect, useState } from "react";
import TopBar from "./TopBar";
import { useTheme } from "./SwitchTheme";
import genresArr from "../data/genres";
import { useUser } from "./UserContext";
import { useSearch } from "./SearchContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_KEY = process.env.REACT_APP_API_KEY_SMALLER;
const MOVIE_API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${MOVIE_API_KEY}`,
  },
};

export default function Recs() {
  let indexOfFavorites = false;

  const userData = useUser();

  const { theme } = useTheme();
  const { searchList } = useSearch();

  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    let k = 0;

    const preferences = localStorage.getItem("preferences").split(",");

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
          const genresSet = new Set();

          if (data.length > 0) {
            k = 1;
            data.forEach((movie) => {
              movie.genre_ids.forEach((genre) => genresSet.add(genre));
            });
          } else if (data.length === 0 && searchList.length !== 0) {
            searchList.forEach((keyword) => {
              genresSet.add(keyword.query);
            });
          } else {
            k = 1;
            preferences.forEach((item) => genresSet.add(item));
          }

          if (genresSet.size === 0) {
            setLoading(false);
            return;
          }

          const genreRequests = [...genresSet].map(async (genre) => {
            let response2;
            if (k === 1) {
              response2 = await fetch(
                `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre}&language=uk` //en
              );
            } else if (k === 0) {
              response2 = await fetch(
                `https://api.themoviedb.org/3/search/movie?query=${genre}&language=uk`, //en-US
                options
              );
            }

            if (response2.ok) {
              const data2 = await response2.json();
              return data2.results;
            }
          });

          const resultsArr = Promise.all(genreRequests);
          const shuffle = (await resultsArr)
            .flat()
            .sort(() => Math.random() - 0.5)
            .slice(0, 20);
          setRecs(shuffle);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    getFavorites();
  }, [searchList]);

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

  function getYear(fullDate) {
    const newDate = fullDate.split("-");
    return newDate[0];
  }

  function getGenre(idArr) {
    const genre = idArr[0];
    return genresArr.movie_genres_ids[genre];
  }

  return (
    <div>
      <TopBar />

      <h1 className={`title-h1 ${theme}`}>
        {/*Your recommendations:*/}Ваші рекомендації:
      </h1>

      <div className="movie-list-div">
        {loading ? (
          <p>{/*Loading...*/}Завантаження...</p>
        ) : (
          recs.map((movie, index) => (
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
                  {/*Rate:*/}Рейтинг: {movie.vote_average.toFixed(1)}/10
                </h1>

                <p className={`info-window-p ${theme}`}>
                  <b>{/*Original title:*/}Оригінальна назва: </b>{" "}
                  {movie.original_title}
                </p>

                <p className={`info-window-p ${theme}`}>
                  <b>{/*Genres:*/}Жанри: </b> {getFullGenres(movie.genre_ids)}
                </p>

                <h2 id="overview-h1" className={theme}>
                  {/*Overview*/}Огляд
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
          ))
        )}
      </div>
    </div>
  );
}
