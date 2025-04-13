const Comment = require("../models/Comment");

const createComment = async (req, res) => {
  try {
    const { movieId, text, userId } = req.body;

    const newComment = new Comment({
      movieId,
      userId,
      text,
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error was happened while creating a comment" });
  }
};

const getCommentsByMovie = async (req, res) => {
  try {
    const comments = await Comment.find({
      movieId: req.params.movieId,
    }).populate("userId", "userName");
    res.json(comments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An errror was happened while getting comments" });
  }
};

const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return res.status(404).json({ error: "The comment wasn't found" });

    comment.text = req.body.text;
    await comment.save();
    res.json(comment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error was happened while updating the comment" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return res.status(404).json({ error: "The comment wasn't found" });

    await comment.deleteOne();
    res.json({ message: "The comment was successfully deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Ann error was happened while deleting the comment" });
  }
};

module.exports = {
  createComment,
  getCommentsByMovie,
  updateComment,
  deleteComment,
};
