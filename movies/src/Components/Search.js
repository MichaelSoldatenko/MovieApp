import "../styles/TopBar.css";
import { useTheme } from "./SwitchTheme";

export default function Search() {
  const { theme } = useTheme();

  function searchMovies(event) {
    event.preventDefault();
    window.location.href = `/search/${event.target[0].value}`;
  }

  return (
    <div>
      <form className="search-form" onSubmit={searchMovies}>
        <input
          type="text"
          placeholder="Search"
          className={`search-input ${theme}`}
        />
        <button type="submit" id="search-btn"></button>
      </form>
    </div>
  );
}
