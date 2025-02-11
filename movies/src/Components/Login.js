import { useTheme } from "./SwitchTheme";
import "../styles/Login.css";
import "../responsive/Login.css";
import "../styles/TopBar.css";
import { useRef, useState } from "react";

export default function Login() {
  const { theme, toggleTheme } = useTheme();

  const [color, setColor] = useState("");
  const [show, setShow] = useState("password");
  const [message, setMessage] = useState("");

  const userNameRef = useRef();
  const passwordRef = useRef();

  async function loignHandler(e) {
    e.preventDefault();

    const userName = userNameRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          password,
        }),
      });

      if (response.status >= 400 && response.status < 500) {
        setColor("pink");
        setMessage("Invalid user name or password");
      }

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        window.location.href = "/home";
      }
    } catch (err) {
      setMessage("An error was happend. Try later");
    }
  }

  return (
    <div>
      <div className={`background-div ${theme}`}>
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
        <div className={`login-signup-div ${theme}`}>
          <p
            className={`message-p`}
            style={{
              color: "red",
              width: "300px",
              bottom: "110%",
            }}
          >
            {message}
          </p>
          <h1 className={`login-signup-h1 ${theme}`}>Log In</h1>
          <input
            type="text"
            name="username"
            id="username"
            ref={userNameRef}
            className={`login-signup-input ${theme}`}
            placeholder="User Name"
            style={{
              backgroundColor: color,
            }}
          />
          <br />
          <input
            type={show}
            name="password"
            id="password"
            ref={passwordRef}
            className={`login-signup-input ${theme}`}
            placeholder="Password"
            style={{
              backgroundColor: color,
            }}
          />
          <button
            className="eye-btn"
            style={{
              top: "46.5%",
              right: "5%",
            }}
            onClick={() => {
              show === "password" ? setShow("text") : setShow("password");
            }}
          ></button>
          <br />
          <button
            className={`login-signup-btn ${theme}`}
            onClick={loignHandler}
          >
            Log In
          </button>
          <p className={`login-signup-p ${theme}`}>
            Don't have an account yet?
          </p>
          <a href="/signup" className={`login-signup-a ${theme}`}>
            Let's create
          </a>
          <br />
          <a
            style={{
              color: "rgb(169, 177, 250)",
              position: "absolute",
              left: "50%",
              bottom: "-25%",
              transform: "translate(-50%)",
            }}
            href="/forgotPassword"
          >
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}
