import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600
      bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200
      hover:bg-slate-100 dark:hover:bg-slate-700"
    >
      {dark ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}
