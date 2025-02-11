import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export default function SwitchTheme({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light-theme"
  );

  function toggleTheme() {
    const newTheme = theme === "light-theme" ? "dark-theme" : "light-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }

  useEffect(() => {
    document.body.className = "";
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <div>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </div>
  );
}

export const useTheme = () => useContext(ThemeContext);
