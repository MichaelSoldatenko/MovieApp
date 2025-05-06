import Search from "./Search";
import { useTheme } from "./SwitchTheme";
import ProfileWindow from "./ProfileWindow";
import "../responsive/TopBar.css";

export default function TopBar(props) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`top-bar ${theme}`}>
      <label className="checkbox-label" htmlFor="checkbox">
        <input
          type="checkbox"
          onChange={toggleTheme}
          checked={theme === "dark-theme"}
          className="checkbox-input"
          id="checkbox"
        />
        <span className="checkbox-text"></span>
      </label>
      <div className={`navigation-div ${theme}`}>
        <h1 className={`navigation-h1 ${theme}`}>
          <a className={`home-a ${theme}`} href="/home">
            {/*Home*/}Головна
          </a>
        </h1>
        <div className={`down-list ${theme}`}>
          <div className={`navigation-ul ${theme}`}>
            <p className={`navigation-li ${theme}`}>
              <a className={`navigation-a ${theme}`} href="/genres">
                {/*Genres*/}Жанри
              </a>
            </p>
            <p className={`navigation-li ${theme}`}>
              <a className={`navigation-a ${theme}`} href="/favorites">
                {/*Favorite*/}Улюблені
              </a>
            </p>
            <p className={`navigation-li ${theme}`}>
              <a className={`navigation-a ${theme}`} href="/profile">
                {/*Profile*/}Профіль
              </a>
            </p>
            <p className={`navigation-li ${theme}`}>
              <a className={`navigation-a ${theme}`} href="/recs">
                {/*Recs*/}Рекомендації
              </a>
            </p>
          </div>
        </div>
      </div>

      <Search />
      <ProfileWindow />
    </div>
  );
}
