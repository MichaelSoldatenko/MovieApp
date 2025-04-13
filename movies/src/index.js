import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import SwitchTheme from "./Components/SwitchTheme";
import { UserProvider } from "./Components/UserContext";
import { SearchProvider } from "./Components/SearchContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SwitchTheme>
      <UserProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </UserProvider>
    </SwitchTheme>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
