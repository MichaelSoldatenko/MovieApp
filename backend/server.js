const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const movieRoutes = require("./routes/movieRoutes");

const app = express();

app.use(express.json());

app.use(cors({ origin: "http://localhost:3000" }));

mongoose.connect("mongodb://localhost:27017/movieApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api/auth", authRoutes);
app.use("/api", movieRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
