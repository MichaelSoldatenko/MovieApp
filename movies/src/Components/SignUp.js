import "../styles/Login.css";
import { useTheme } from "./SwitchTheme";
import { useRef, useState } from "react";

export default function SignUp() {
  const { theme, toggleTheme } = useTheme();

  const [color, setColor] = useState("");
  const [message, setMessage] = useState("");
  const [show, setShow] = useState("password");

  const userNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const repeatPasRef = useRef();
  const genderRef = useRef();

  async function handleRegistration(e) {
    e.preventDefault();

    const userName = userNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const repeat = repeatPasRef.current.value;
    const gender = genderRef.current.value;

    if (password !== repeat) {
      setColor("pink");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          email,
          password,
          gender,
        }),
      });

      if (response.status >= 400 && response.status < 500) {
        setMessage("Invalid data");
      }

      if (response.ok) {
        const data = await response.json();
        window.location.href = "/";
        setColor("");
      }
    } catch (err) {
      setMessage("An error was happened. Try later");
    }
  }

  return (
    <div>
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
      <div className={`background-div ${theme}`}>
        <div className={`login-signup-div ${theme}`}>
          <p
            className={`message-p`}
            style={{
              color: "red",
              bottom: "95%",
              width: "300px",
            }}
          >
            {message}
          </p>
          <h1 className={`login-signup-h1 ${theme}`}>Sign Up</h1>
          <input
            type="text"
            name="username"
            id="username"
            ref={userNameRef}
            placeholder="User Name"
            className={`login-signup-input ${theme}`}
          />
          <input
            type="text"
            name="email"
            id="email"
            ref={emailRef}
            placeholder="Email"
            className={`login-signup-input ${theme}`}
          />
          <input
            type={show}
            name="password"
            id="password"
            ref={passwordRef}
            placeholder="Password"
            className={`login-signup-input ${theme}`}
          />
          <button
            className="eye-btn"
            style={{
              top: "45.5%",
              right: "5%",
            }}
            onClick={() => {
              show === "password" ? setShow("text") : setShow("password");
            }}
          ></button>
          <input
            type="password"
            name="repeat"
            id="repeat"
            ref={repeatPasRef}
            placeholder="Repeat Password"
            className={`login-signup-input ${theme}`}
            style={{
              backgroundColor: color,
            }}
          />
          <select name="gender" id="gender" className={theme} ref={genderRef}>
            <option value="Male" className={`gender-options ${theme}`}>
              Male
            </option>
            <option value="Female" className={`gender-options ${theme}`}>
              Female
            </option>
            <option value="Other" className={`gender-options ${theme}`}>
              Other
            </option>
          </select>

          <button
            className={`login-signup-btn ${theme}`}
            onClick={handleRegistration}
          >
            Sign Up
          </button>
          <p className={`login-signup-p ${theme}`}>Already have an account?</p>
          <a href="/" className={`login-signup-a ${theme}`}>
            Authorize
          </a>
        </div>
      </div>
    </div>
  );
}
