import { useEffect, useState } from "react";
import genresIcons from "../data/genres-icons";
import "../styles/Preferences.css";
import { useTheme } from "./SwitchTheme";

const MOVIE_API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

export default function Preferences() {
  const [genresList, setGenresList] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [message, setMessage] = useState("");

  const { theme, toggleTheme } = useTheme();

  function savePreferences() {
    if (selectedGenres.length === 0) {
      setMessage("Виберіть принаймні один жанр щоб продовжити"); //"Choose at least one genre to continue"
      return;
    }
    localStorage.setItem("preferences", selectedGenres);
    window.location.href = "/home";
  }

  function handleSelectGenre(value) {
    setSelectedGenres((preview) =>
      preview.includes(value.id)
        ? preview.filter((item) => item !== value.id)
        : [...preview, value.id]
    );
  }

  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?language=uk`, //en
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${MOVIE_API_KEY}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setGenresList(data.genres);
          console.log(data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchGenres();
  }, []);

  return (
    <div>
      <label
        style={{
          top: "15px",
          left: "2%",
        }}
        className="checkbox-label"
        htmlFor="checkbox"
      >
        <input
          type="checkbox"
          onChange={toggleTheme}
          checked={theme === "dark-theme"}
          className="checkbox-input"
          id="checkbox"
        />
        <span className="checkbox-text"></span>
      </label>
      <p
        className={`message-p`}
        style={{
          color: "red",
          top: "5%",
          height: "20px",
          width: "300px",
        }}
      >
        {message}
      </p>
      <button className={theme} onClick={savePreferences} id="continue-btn">
        {/*Continue*/}Далі
      </button>
      <div className="genres-div">
        {genresList.map((item) => (
          <label className={`genre-block ${theme}`} key={item.id}>
            <input
              type="checkbox"
              onChange={() => handleSelectGenre(item)}
              className="genre-checkbox"
            />
            <h4 className="genre-h4">{item.name}</h4>
            <img
              src={genresIcons.movie_genres_icons[item.id]}
              className="genre-img"
              alt="icon"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
