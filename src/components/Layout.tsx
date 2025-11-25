import { NavLink, Outlet } from "react-router-dom";
import { Home, Search, Heart, Sun, Moon } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import { useEffect, useState } from "react";

export default function Layout() {
  const { favorites } = useFavorites();
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Récupère le thème sauvegardé ou détecte le préférence système
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Applique la classe au <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const navItems = [
    { to: "/", icon: Home, label: "Accueil" },
    { to: "/recherche", icon: Search, label: "Recherche" },
    { to: "/favoris", icon: Heart, label: "Favoris", badge: favorites.length },
  ];

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Gauche : Logo + Toggle sombre */}
          <div className="flex items-center gap-6">
            <NavLink
              to="/"
              className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
            >
              Cardboard
            </NavLink>

            {/* Toggle Mode Sombre */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              aria-label="Toggle mode sombre"
            >
              <Sun className="w-5 h-5 hidden dark:block text-yellow-400" />
              <Moon className="w-5 h-5 block dark:hidden text-gray-700" />
            </button>
          </div>

          {/* Droite : Navigation desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-medium"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge != null && item.badge > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Navigation mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
          <div className="flex justify-around py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex flex-col items-center gap-1 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`
                }
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs">{item.label}</span>
                {item.badge != null && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-20 md:pb-8">
        <Outlet />
      </main>
    </>
  );
}
