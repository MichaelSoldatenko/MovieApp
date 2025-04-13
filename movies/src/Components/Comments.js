import { useTheme } from "./SwitchTheme";
import { useUser } from "./UserContext";
import { useEffect, useState, useRef } from "react";

import "../styles/Comments.css";
import "../responsive/Comments.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Comments({ movieID, user }) {
  const { theme } = useTheme();

  const userData = useUser();

  const [comments, setComments] = useState([]);
  const [edit, setEdit] = useState("");
  const [currentId, setCurrentId] = useState("");

  const textRef = useRef();
  const updatedCommentRef = useRef();

  function convertDate(strDate) {
    const date = new Date(strDate);

    const day = date.getUTCDate().toString().padStart(2, "0");
    const month = date.getUTCMonth().toString().padStart(2, "0");
    const year = date.getUTCFullYear();
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");

    return `${day}.${month}.${year} at ${hours}:${minutes}`;
  }

  async function deleteComment(id) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BACKEND_URL}/api/comments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handleUpdateComment(id, text) {
    setEdit(text);
    setCurrentId(id);
  }

  async function updateComment(id, text) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BACKEND_URL}/api/comments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setEdit("");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function addComment() {
    const text = textRef.current.value;

    if (!text.trim()) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${BACKEND_URL}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId: movieID,
          text: text,
          userId: user.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data]);
        textRef.current.value = "";
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(`${BACKEND_URL}/api/comments/${movieID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setComments(data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchComments();
  }, [movieID]);

  return (
    <div>
      <div className="comments-div">
        {userData.message !== "Invalid token" ? (
          <div>
            <textarea
              placeholder="Enter the comment..."
              name="comment"
              className={`add-comment-area ${theme}`}
              ref={textRef}
            ></textarea>
            <br />
            <button className={`add-comment-btn ${theme}`} onClick={addComment}>
              Add the comment
            </button>{" "}
          </div>
        ) : (
          <p></p>
        )}
        <ul className={`comment-ul ${theme}`}>
          {comments.map((comment) => {
            return (
              <li key={comment._id} className={`comment-li ${theme}`}>
                <p className={`comment-p user-name ${theme}`}>
                  {comment.userId.userName}
                </p>
                {edit && currentId === comment._id ? (
                  <form>
                    <textarea
                      className={`add-comment-area ${theme}`}
                      defaultValue={edit}
                      ref={updatedCommentRef}
                      style={{
                        marginLeft: "0",
                      }}
                    />
                    <br />
                    <button
                      className={`add-comment-btn resave ${theme}`}
                      onClick={() =>
                        updateComment(
                          comment._id,
                          updatedCommentRef.current.value
                        )
                      }
                    >
                      Save
                    </button>
                  </form>
                ) : (
                  <p className={`comment-p message ${theme}`}>{comment.text}</p>
                )}
                <span className={`comment-p date ${theme}`}>
                  {convertDate(comment.createdAt)}
                </span>
                {comment.userId._id === userData.id ? (
                  <div className="edit-btns-div">
                    <button
                      className={`comment-btns change ${theme}`}
                      onClick={() =>
                        handleUpdateComment(comment._id, comment.text)
                      }
                    ></button>
                    <button
                      className={`comment-btns delete ${theme}`}
                      onClick={() => deleteComment(comment._id)}
                    ></button>
                  </div>
                ) : (
                  <p></p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
