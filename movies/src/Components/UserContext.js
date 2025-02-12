import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export function UserProvider({ children }) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    async function fetchUserData() {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${BACKEND_URL}/api/auth/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setUserData(data);
      } catch (err) {}
    }

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
