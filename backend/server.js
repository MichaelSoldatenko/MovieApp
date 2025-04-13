const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");
const commentRoutes = require("./routes/commentRoutes");
const searchRoutes = require("./routes/searchRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin:
      "https://movie-app-psi-inky.vercel.app" /*"http://localhost:3000"  "https://movie-app-psi-inky.vercel.app"*/,
  })
);

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/movieApp";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api", movieRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/comments", commentRoutes);
app.use("/api/search", searchRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
