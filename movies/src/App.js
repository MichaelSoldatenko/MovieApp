import Home from "./Components/Home";
import MovieInfo from "./Components/MovieInfo";
import FoundMovies from "./Components/FoundMovies";
import Genres from "./Components/Genres";
import GenresList from "./Components/GenresList";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import Profile from "./Components/Profile";
import Favorites from "./Components/Favorites";
import Error from "./Components/Error";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/:movieID" element={<MovieInfo />} />
          <Route exact path="/search/:foundMovies" element={<FoundMovies />} />
          <Route path="/genres/:genreID" element={<Genres />} />
          <Route path="/genres" element={<GenresList />} />
          <Route exact path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
