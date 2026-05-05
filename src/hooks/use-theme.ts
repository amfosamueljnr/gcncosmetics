// Simple Vite-compatible theme hook (replaces next-themes)
export const useTheme = () => {
  const getTheme = (): string => {
    // Check localStorage first
    const stored = localStorage.getItem("theme");
    if (stored) return stored;

    // Check system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  };

  const theme = getTheme();

  const setTheme = (newTheme: string) => {
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return { theme: theme as "light" | "dark" | "system", setTheme };
};
