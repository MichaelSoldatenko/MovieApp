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
        setMessage("Invalid email");
      }

      if (response.ok) {
        const data = await response.json();
        setMessage("Check your email");
      }
    } catch (err) {
      setMessage("An error was happened. Try later");
    }
  }

  return (
    <div>
      <div className={`forgot-reset-password-div ${theme}`}>
        <label
          className="checkbox-label"
          htmlFor="checkbox"
          style={{
            top: "5%",
            right: "15%",
          }}
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

        <form
          onSubmit={handleSubmit}
          className={`forgot-password-form ${theme}`}
        >
          <input
            type="email"
            placeholder="Enter your email"
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
            Cancel
          </button>
          <button
            style={{
              marginLeft: "5px",
            }}
            className={`login-signup-btn ${theme}`}
            type="submit"
          >
            Next
          </button>
        </form>
        <p className={`message-p ${theme}`}>{message}</p>
      </div>
    </div>
  );
}
