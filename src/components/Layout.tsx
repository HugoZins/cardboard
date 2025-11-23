import { Home, Search, Heart, Info } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function Layout() {
  const { favorites } = useFavorites();

  const navItems = [
    { to: "/", icon: Home, label: "Accueil" },
    { to: "/recherche", icon: Search, label: "Recherche" },
    {
      to: "/favoris",
      icon: Heart,
      label: "Favoris",
      badge: favorites.length,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-3 group -ml-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight group-hover:scale-105 transition-transform">
                Cardboard
              </h1>
            </NavLink>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${
                      isActive
                        ? "bg-white text-indigo-600 shadow-md"
                        : "hover:bg-indigo-700"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            <div className="flex md:hidden items-center justify-center gap-8 flex-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm ${
                      isActive
                        ? "bg-white text-indigo-600 font-bold"
                        : "hover:bg-indigo-700"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.badge > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>© 2025 - Cardboard</p>
      </footer>
    </div>
  );
}
