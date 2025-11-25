import { useNavigate } from "react-router-dom";
import GameCard from "../components/GameCard";
import jeux from "../data/jeux.json";
import { ArrowRight } from "lucide-react";

const popularGames = [...jeux]
  .sort((a, b) => b.popularity - a.popularity)
  .slice(0, 8);

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          Trouvez votre prochain jeu de société
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Plus de 25 jeux triés sur le volet pour tous les goûts
        </p>
        <button
          onClick={() => navigate("/recherche")}
          className="mt-10 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
        >
          Commencer la recherche <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      <section className="my-20">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Populaires cette semaine
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onClick={() => navigate(`/jeu/${game.id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
