import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
const [dark, setDark] = useState(() => {
return localStorage.getItem("theme") === "dark";
});

useEffect(() => {
document.body.style.backgroundColor = dark ? "#1f1f1f" : "#ffffff";
localStorage.setItem("theme", dark ? "dark" : "light");
}, [dark]);

const toggleTheme = () => setDark(prev => !prev);

return (
<ThemeContext.Provider value={{ dark, toggleTheme }}>
{children}
</ThemeContext.Provider>
);
};

export const useTheme = () => useContext(ThemeContext);