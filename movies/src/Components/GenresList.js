import TopBar from "./TopBar";
import { useEffect, useState } from "react";
import "../styles/GenresList.css";
import genresIcons from "../data/genres-icons";
import { useTheme } from "./SwitchTheme";

const MOVIE_API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${MOVIE_API_KEY}`,
  },
};

export default function GenresList() {
  const [genres, setGenres] = useState([]);

  const { theme } = useTheme();

  async function fetchGenresList() {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?language=en`,
        options
      );
      const data = await response.json();
      setGenres(data.genres);
    } catch (err) {}
  }

  function openGenrePage(id) {
    window.location.href = `/genres/${id}`;
  }

  useEffect(() => {
    fetchGenresList();
  }, []);

  return (
    <div>
      <TopBar />

      <h1
        className={`title-h1 ${theme}`}
        style={{
          top: "35%",
          left: "20px",
        }}
      >
        Select Your Genre:
      </h1>

      <div className="genres-list">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className="genre-div"
            onClick={() => openGenrePage(genre.id)}
            style={{
              backgroundImage: `url(${
                genresIcons.movie_genres_icons[genre.id]
              })`,
            }}
          >
            <h3 className="genre-h3">{genre.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
