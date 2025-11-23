import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { useState } from "react";

type Game = {
  id: number;
  title: string;
  image: string;
  minPlayers: number;
  maxPlayers: number;
  minDuration: number;
  maxDuration: number;
  age: number;
  complexity: number;
  price: number;
};

type Props = {
  game: Game;
  onClick?: () => void;
  onRemoveFromFavorites?: () => void;
};

export default function GameCard({
  game,
  onClick,
  onRemoveFromFavorites,
}: Props) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);

  const badgeColor =
    game.complexity <= 2
      ? "bg-green-500"
      : game.complexity <= 3
      ? "bg-yellow-500"
      : "bg-red-500";
  const badgeText =
    game.complexity <= 2 ? "Léger" : game.complexity <= 3 ? "Moyen" : "Expert";

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (onRemoveFromFavorites) {
      onRemoveFromFavorites();
    } else {
      toggleFavorite(game);
    }
  };

  return (
    <div
      className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full cursor-pointer transform hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative h-64 bg-gray-100">
        <img
          src={game.image}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          onError={(e) =>
            (e.currentTarget.src =
              "https://via.placeholder.com/400x300/1a1a1a/ffffff?text=No+Image")
          }
        />
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg ${badgeColor}`}
        >
          {badgeText}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2">
            {game.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span>
              {game.minPlayers}–{game.maxPlayers} joueurs
            </span>
            <span>•</span>
            <span>
              {game.minDuration}–{game.maxDuration} min
            </span>
            <span>•</span>
            <span>{game.age}+</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-bold text-indigo-600">
            {game.price}€
          </span>
          <button
            onClick={handleHeartClick}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Heart
              className={`w-7 h-7 transition-all ${
                isFavorite(game.id)
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-gray-400 hover:text-red-500"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
