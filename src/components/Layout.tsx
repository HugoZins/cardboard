import { NavLink, Outlet } from "react-router-dom";
import { Home, Search, Heart } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";

export default function Layout() {
  const { favorites } = useFavorites();

  const navItems = [
    { to: "/", icon: Home, label: "Accueil" },
    { to: "/recherche", icon: Search, label: "Recherche" },
    { to: "/favoris", icon: Heart, label: "Favoris", badge: favorites.length },
  ];

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold text-indigo-600">
            Cardboard
          </NavLink>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-indigo-100 text-indigo-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {/* Badge sécurisé */}
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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex justify-around py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-4 py-3 rounded-lg transition ${
                    isActive ? "text-indigo-600" : "text-gray-500"
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

      <main className="pb-20 md:pb-8">
        <Outlet />
      </main>
    </>
  );
}
