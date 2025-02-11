import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    async function fetchUserData() {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:5000/api/auth/user", {
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
