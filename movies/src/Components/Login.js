import { useTheme } from "./SwitchTheme";
import "../styles/Login.css";
import "../responsive/Login.css";
import "../styles/TopBar.css";
import { useRef, useState } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Login() {
  const { theme, toggleTheme } = useTheme();

  const [color, setColor] = useState("");
  const [show, setShow] = useState("password");
  const [message, setMessage] = useState("");

  const userNameRef = useRef();
  const passwordRef = useRef();
  const rememberRef = useRef();

  async function loignHandler(e) {
    e.preventDefault();

    const userName = userNameRef.current.value;
    const password = passwordRef.current.value;
    const remember = rememberRef.current.checked;

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          password,
          remember,
        }),
      });

      if (response.status >= 400 && response.status < 500) {
        setColor("pink");
        setMessage("Неправильний логін або пароль"); //"Invalid user name or password"
      }

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        if (localStorage.getItem("preferences") !== "null")
          window.location.href = "/home";
        else window.location.href = "/preferences";
      }
    } catch (err) {
      setMessage("Сталася помилка. Спробуйте пізніше"); //"An error was happend. Try later"
    }
  }

  return (
    <div>
      <div className={`background-div ${theme}`}>
        <label
          style={{
            top: "1%",
            left: "3%",
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
          <h1 className={`login-signup-h1 ${theme}`}>
            {/*Log In*/}Авторизація
          </h1>
          <input
            type="text"
            name="username"
            id="username"
            ref={userNameRef}
            className={`login-signup-input ${theme}`}
            placeholder="Ім'я користувача" /*"User Name"*/
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
            placeholder="Пароль" /*"Password"*/
            style={{
              backgroundColor: color,
            }}
          />
          <button
            className="eye-btn"
            style={{
              top: "41%",
              right: "5%",
            }}
            onClick={() => {
              show === "password" ? setShow("text") : setShow("password");
            }}
          ></button>

          <p className={`remember-checkbox ${theme}`}>
            <input type="checkbox" ref={rememberRef} />
            {/*Remember me*/}Запам'ятати мене
          </p>

          <button
            className={`login-signup-btn ${theme}`}
            onClick={loignHandler}
          >
            {/*Log In*/}Увійти
          </button>
          <p className={`login-signup-p ${theme}`}>
            {/*Don't have an account yet?*/}Ще не зареєстровані?
          </p>
          <a href="/signup" className={`login-signup-a ${theme}`}>
            {/*Let's create*/}Створити акаунт
          </a>
          <br />
          <a
            style={{
              color: "rgb(169, 177, 250)",
              position: "absolute",
              left: "50%",
              bottom: "-10%",
              transform: "translate(-50%)",
              width: "150px",
            }}
            href="/forgotPassword"
          >
            {/*Forgot password?*/}Забули пароль?
          </a>
        </div>
      </div>
    </div>
  );
}
