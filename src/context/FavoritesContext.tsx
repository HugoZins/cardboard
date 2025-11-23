import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import jeux from "../data/jeux.json";

type Game = (typeof jeux)[0];

type FavoritesContextType = {
  favorites: Game[];
  toggleFavorite: (game: Game) => void;
  isFavorite: (gameId: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Game[]>(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (game: Game) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === game.id)
        ? prev.filter((f) => f.id !== game.id)
        : [...prev, game]
    );
  };

  const isFavorite = (gameId: number) => favorites.some((f) => f.id === gameId);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
};
