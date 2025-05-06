import { useParams } from "react-router";
import { useTheme } from "./SwitchTheme";
import { useState } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function ResetPassword() {
  let { token } = useParams();

  const { theme, toggleTheme } = useTheme();

  const [show, setShow] = useState("password");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const password = e.target[0].value;

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (response.status >= 400 && response.status < 500) {
        setMessage("Неправильний токен або час дії токену вийшов"); // "Invalid token"
      }

      if (response.ok) {
        const data = await response.json();
        window.location.href = "/";
      }
    } catch (err) {}
  }

  return (
    <div>
      <div className={`forgot-reset-password-div ${theme}`}>
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

        <form
          onSubmit={handleSubmit}
          className={`forgot-password-form ${theme}`}
        >
          <input
            type={show}
            placeholder="Введіть Ваш новий пароль" //"Enter your new password"
            className={`login-signup-input ${theme}`}
          />
          <button
            className="eye-btn"
            style={{
              top: "10%",
              right: "5%",
            }}
            onClick={(e) => {
              e.preventDefault();
              show === "password" ? setShow("text") : setShow("password");
            }}
          ></button>
          <br />
          <button
            style={{
              marginRight: "5px",
            }}
            className={`login-signup-btn ${theme}`}
            onClick={() => {
              window.location.href = "/";
            }}
          >
            {/*Cancel*/}Назад
          </button>
          <button
            style={{
              marginLeft: "5px",
            }}
            className={`login-signup-btn ${theme}`}
            type="submit"
          >
            {/*Next*/}Далі
          </button>
        </form>
        <p
          className={`message-p`}
          style={{
            color: "red",
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
