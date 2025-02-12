import TopBar from "../Components/TopBar";
import "../styles/Profile.css";
import "../responsive/Profile.css";
import { useTheme } from "./SwitchTheme";
import { useUser } from "./UserContext";
import { useEffect, useState, useRef } from "react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Profile() {
  const { theme } = useTheme();

  const userData = useUser();

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [hiddenName, setHiddenName] = useState("hidden");
  const [hiddenPasOld, setHiddenPasOld] = useState("hidden");
  const [hiddenPasNew, setHiddenPasNew] = useState("hidden");
  const [hiddenBio, setHiddenBio] = useState("hidden");
  const [show, setShow] = useState("password");

  const userNameRef = useRef();
  const newPasswordRef = useRef();

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

  function handleAvatarChange(e) {
    const file = e.target.files[0];

    if (file) {
      setPreview(URL.createObjectURL(file));
      setAvatar(file);
    }
  }

  async function uploadAvatar() {
    if (!avatar) return;

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/user/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setAvatar(null);
        setPreview(null);
        fetchAvatar();
        window.location.reload();
      } else {
      }
    } catch (err) {}
  }

  function leave() {
    localStorage.setItem("token", null);
    window.location.href = "/";
  }

  async function deleteAccount() {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/user/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.setItem("token", null);
        window.location.href = "/";
      }
    } catch (err) {}
  }

  async function changeName(e) {
    e.preventDefault();

    const userName = userNameRef.current.value;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/user/info`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userName }),
      });

      if (response.ok) {
        const data = await response.json();
        setHiddenName("hidden");
        window.location.reload();
      }
    } catch (err) {}
  }

  async function checkPass(e) {
    e.preventDefault();

    const currentPassword = e.target[0].value;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/user/info`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword }),
      });

      if (response.ok) {
        setHiddenPasOld("hidden");
        setHiddenPasNew("");
      }
    } catch (err) {}
  }

  async function changePass(e) {
    e.preventDefault();

    const newPassword = newPasswordRef.current.value;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/user/info`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      if (response.ok) {
        const data = await response.json();
        setHiddenPasNew("hidden");
        window.location.reload();
      }
    } catch (err) {}
  }

  async function addAbout(e) {
    e.preventDefault();

    const about = e.target[0].value;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/user/about`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ about }),
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (err) {}
  }

  return (
    <div>
      <TopBar />

      {localStorage.getItem("token") !== "null" ? (
        <div>
          <div className={`modal-background ${hiddenName}`}>
            <div className={`modal-div ${theme}`}>
              <form onSubmit={changeName} className="modal-form">
                <h2 className={`modal-h2 ${theme}`}>Enter new username:</h2>
                <input
                  ref={userNameRef}
                  name="usernameInput"
                  type="text"
                  className={`modal-input ${theme}`}
                  placeholder={userData.userName}
                />
                <br />
                <button className={`modal-btns ${theme}`} type="submit">
                  Change
                </button>
                <button
                  className={`modal-btns ${theme}`}
                  onClick={() => setHiddenName("hidden")}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>

          <div className={`modal-background ${hiddenPasOld}`}>
            <div className={`modal-div ${theme}`}>
              <form onSubmit={checkPass} className="modal-form">
                <h2 className={`modal-h2 ${theme}`}>
                  Enter your old password:
                </h2>
                <input
                  name="currentpasInput"
                  type={show}
                  className={`modal-input ${theme}`}
                  placeholder="Enter"
                />
                <button
                  className="eye-btn"
                  style={{
                    top: "46.5%",
                    right: "31%",
                  }}
                  onClick={() => {
                    show === "password" ? setShow("text") : setShow("password");
                  }}
                ></button>
                <br />
                <button type="submit" className={`modal-btns ${theme}`}>
                  Next
                </button>
                <button
                  className={`modal-btns ${theme}`}
                  onClick={() => setHiddenPasOld("hidden")}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>

          <div className={`modal-background ${hiddenPasNew}`}>
            <div className={`modal-div ${theme}`}>
              <form onSubmit={changePass} className="modal-form">
                <h2 className={`modal-h2 ${theme}`}>Create new password:</h2>
                <input
                  ref={newPasswordRef}
                  name="newpasInput"
                  type={show}
                  className={`modal-input ${theme}`}
                  placeholder="Enter"
                />
                <button
                  className="eye-btn"
                  style={{
                    top: "46.5%",
                    right: "31%",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    show === "password" ? setShow("text") : setShow("password");
                  }}
                ></button>
                <br />
                <button type="submit" className={`modal-btns ${theme}`}>
                  Change
                </button>
                <button
                  className={`modal-btns ${theme}`}
                  onClick={() => setHiddenPasNew("hidden")}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>

          <div className="user-info-div">
            <div className={`profile-img-div ${theme}`}>
              <img
                src={preview || avatar}
                alt="profile-img"
                className="profile-img"
              />
              <br />
              <label
                htmlFor="file-input"
                className={`profile-change-photo-btn ${theme}`}
                style={{
                  paddingTop: "6px",
                }}
              >
                Change photo
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <br />
              {preview && (
                <button
                  className={`profile-change-photo-btn ${theme}`}
                  onClick={uploadAvatar}
                >
                  Save
                </button>
              )}
            </div>

            <div className={`profile-info-div ${theme}`}>
              <h1 className={`title-text ${theme}`}>User Info</h1>
              <p className={`profile-info-text ${theme}`}>
                <b>User Name:</b> {userData.userName}
              </p>
              <p className={`profile-info-text ${theme}`}>
                <b>Email:</b> {userData.email}
              </p>
              <p className={`profile-info-text ${theme}`}>
                <b>Gender:</b> {userData.gender}
              </p>
              <p className={`profile-info-text ${theme}`}>
                <b>About:</b> {userData.about}
              </p>

              <div>
                {userData.about ? (
                  <button
                    className={`change-bio-btn ${theme}`}
                    onClick={() => setHiddenBio("")}
                  >
                    Change bio
                  </button>
                ) : (
                  <form onSubmit={addAbout}>
                    <h4 className={`title ${theme}`}>Add bio:</h4>
                    <textarea
                      className={`add-info-area ${theme}`}
                      placeholder="Enter info..."
                    ></textarea>
                    <br />
                    <button type="submit" className={`save-btn ${theme}`}>
                      Save
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className={`modal-background ${hiddenBio}`}>
              <div className={`modal-div ${theme}`}>
                <form
                  onSubmit={addAbout}
                  style={{
                    marginTop: "50px",
                  }}
                >
                  <h4 className={`title ${theme}`}>Add bio:</h4>
                  <textarea
                    className={`add-info-area ${theme}`}
                    placeholder="Enter info..."
                  ></textarea>
                  <br />
                  <button type="submit" className={`save-btn ${theme}`}>
                    Save
                  </button>
                  <button
                    className={`save-btn ${theme}`}
                    onClick={() => setHiddenBio("hidden")}
                  >
                    Close
                  </button>
                </form>
              </div>
            </div>

            <div className={`controls-div ${theme}`}>
              <h1 className={`title-text ${theme}`}>Controls</h1>
              <button
                className={`control-btns ${theme} edit`}
                onClick={() => setHiddenName("")}
              >
                Change username
              </button>
              <br />
              <button
                className={`control-btns ${theme} edit`}
                onClick={() => setHiddenPasOld("")}
              >
                Change password
              </button>
              <br />
              <button
                className={`control-btns ${theme}`}
                onClick={leave}
                id="leave-btn"
              >
                Leave
              </button>
              <br />
              <button
                className={`control-btns ${theme}`}
                onClick={deleteAccount}
                id="delete-btn"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className={`profile-login-btn ${theme}`}
        >
          Log In
        </button>
      )}
    </div>
  );
}
