import { createContext, useContext, useEffect, useState } from "react";

const SearchContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export function SearchProvider({ children }) {
  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${BACKEND_URL}/api/search/history`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSearchList(data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchHistory();
  }, []);

  return (
    <SearchContext.Provider value={{ searchList, setSearchList }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
