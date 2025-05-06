import { useTheme } from "./SwitchTheme";
import "../styles/ForgotPassword.css";
import "../responsive/ForgotPassword.css";
import { useState } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function ForgotPassword() {
  const { theme, toggleTheme } = useTheme();

  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const email = e.target[0].value;

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.status >= 400 && response.status < 500) {
        setMessage("Неправильна електронна пошта"); //"Invalid email"
      }

      if (response.ok) {
        const data = await response.json();
        setMessage("Перевірте Вашу пошту"); //"Check your email"
      }
    } catch (err) {
      setMessage("Сталася помилка. Спробуйте пізніше"); //"An error was happened. Try later"
    }
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
            type="email"
            placeholder="Введіть Вашу пошту" //"Enter your email"
            className={`login-signup-input ${theme}`}
          />
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
            Назад{/*Cancel*/}
          </button>
          <button
            style={{
              marginLeft: "5px",
            }}
            className={`login-signup-btn ${theme}`}
            type="submit"
          >
            Далі{/*Next*/}
          </button>
        </form>
        <p className={`message-p ${theme}`}>{message}</p>
      </div>
    </div>
  );
}
