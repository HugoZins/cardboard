import { createContext, useState, type ReactNode } from "react";
import jeux from "../data/jeux.json";

export type Game = typeof jeux[0];

export type FavoritesContextType = {
  favorites: Game[];
  toggleFavorite: (game: Game) => void;
  isFavorite: (gameId: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Game[]>([]);

  const toggleFavorite = (game: Game) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === game.id);
      if (exists) {
        return prev.filter((f) => f.id !== game.id);
      }
      return [...prev, game];
    });
  };

  const isFavorite = (gameId: number) => {
    return favorites.some((f) => f.id === gameId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export { FavoritesContext };