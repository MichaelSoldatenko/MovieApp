import "../styles/TopBar.css";
import "../styles/SearchHistory.css";
import "../responsive/SearchHistory.css";
import { useTheme } from "./SwitchTheme";
import { useSearch } from "./SearchContext";
import { useState } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Search() {
  const { theme } = useTheme();
  const { searchList, setSearchList } = useSearch();

  const [hidden, setHidden] = useState("hidden");

  async function searchMovies(event) {
    event.preventDefault();
    const query = event.target[0].value;

    if (!query) return;

    window.location.href = `/search/${query}`;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BACKEND_URL}/api/search/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      if (response.ok) {
        const newQuery = { query };
        setSearchList((prev) => [...prev, newQuery]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function searchMoviesHistory(query) {
    window.location.href = `/search/${query}`;
  }

  return (
    <div>
      <div
        className="search-form"
        onMouseOver={() => setHidden("")}
        onMouseOut={() => setHidden("hidden")}
      >
        <form onSubmit={searchMovies}>
          <input
            type="text"
            placeholder="Пошук" //"Search"
            className={`search-input ${theme}`}
          />
          <button type="submit" id="search-btn"></button>
        </form>

        <div className={`search-list-div ${theme} ${hidden}`}>
          <ul className={`search-list-ul ${theme}`}>
            {searchList.map((item) => (
              <li
                className={`search-list-li ${theme}`}
                key={item._id}
                onClick={() => searchMoviesHistory(item.query)}
              >
                {item.query}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
