import "../styles/ProfileWindow.css";
import "../responsive/ProfileWindow.css";
import { useTheme } from "./SwitchTheme";
import { useState, useEffect } from "react";
import { useUser } from "./UserContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function ProfileWindow(props) {
  const { theme } = useTheme();

  const userData = useUser();

  const [hidden, setHidden] = useState("hidden");
  const [avatar, setAvatar] = useState(null);

  function hiddenHandle() {
    setHidden(hidden === "hidden" ? "" : "hidden");
  }

  function logOut() {
    localStorage.setItem("token", null);
    window.location.href = "/";
  }

  function moreInfo() {
    window.location.href = "/profile";
  }

  async function fetchAvatar() {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/user/avatar`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.blob();
        setAvatar(URL.createObjectURL(data));
      }
    } catch (err) {}
  }

  useEffect(() => {
    fetchAvatar();
  }, []);

  return (
    <div>
      <button className={`profile-btn ${theme}`} onClick={hiddenHandle}>
        {avatar ? (
          <img className="profile-window-img" src={avatar} alt="avatar" />
        ) : (
          ""
        )}
      </button>
      <div className={`profile-div ${theme} ${hidden}`}>
        {userData.message ? (
          <button
            className={`login-btn ${theme}`}
            onClick={() => {
              window.location.href = "/";
            }}
          >
            {/*Log In*/}Увійти
          </button>
        ) : (
          <div>
            <p
              className={`profile-text ${theme}`}
              style={{
                marginLeft: "7px",
                marginRight: "7px",
              }}
            >
              {userData.userName}
            </p>
            <hr className={`profile-hr ${theme}`} />
            <p
              className={`profile-text ${theme}`}
              style={{
                marginLeft: "7px",
                marginRight: "7px",
              }}
            >
              {userData.email}
            </p>
            <hr className={`profile-hr ${theme}`} />
            <div className={`profile-text button ${theme}`} onClick={logOut}>
              {/*Log Out*/}Вийти
            </div>
            <hr className={`profile-hr ${theme}`} />
            <div className={`profile-text button ${theme}`} onClick={moreInfo}>
              {/*More Info*/}Більше інформації
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
