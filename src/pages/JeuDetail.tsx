import { useParams, useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import jeux from "../data/jeux.json";
import { ArrowLeft, Heart, ExternalLink } from "lucide-react";
import GameCard from "../components/GameCard";

export default function JeuDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  const game = jeux.find((g) => g.id === Number(id));
  if (!game) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300">
          Jeu non trouvé
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-5 h-5" /> Retour
        </button>
      </div>
    );
  }

  const isFav = isFavorite(game.id);

  const badgeColor =
    game.complexity <= 2
      ? "bg-green-500"
      : game.complexity <= 3
      ? "bg-yellow-500"
      : "bg-red-500";
  const badgeText =
    game.complexity <= 2 ? "Léger" : game.complexity <= 3 ? "Moyen" : "Expert";

  const similarGames = jeux
    .filter((g) => g.id !== game.id)
    .map((g) => {
      let score = 0;
      const commonCategories = g.categories.filter((c) =>
        game.categories.includes(c)
      ).length;
      score += commonCategories * 3;
      const commonThemes = g.themes.filter((t) =>
        game.themes.includes(t)
      ).length;
      score += commonThemes * 2;
      if (
        Math.abs(g.minPlayers - game.minPlayers) <= 1 &&
        Math.abs(g.maxPlayers - game.maxPlayers) <= 1
      )
        score += 1;
      if (Math.abs(g.complexity - game.complexity) <= 1) score += 1;
      return { game: g, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((item) => item.game);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline mb-8 text-lg"
      >
        <ArrowLeft className="w-5 h-5" /> Retour
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <img
            src={
              game.image.startsWith("http")
                ? game.image
                : import.meta.env.BASE_URL + game.image.replace(/^\//, "")
            }
            alt={game.title}
            className="w-full rounded-xl shadow-2xl object-cover border border-gray-200 dark:border-gray-700"
            onError={(e) =>
              (e.currentTarget.src =
                "https://via.placeholder.com/600x800/1a1a1a/ffffff?text=No+Image")
            }
          />
        </div>

        <div className="space-y-10">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {game.title}
            </h1>
            <div className="flex items-center gap-4">
              <span
                className={`px-5 py-2 rounded-full text-white font-bold text-lg ${badgeColor}`}
              >
                {badgeText}
              </span>
              <button
                onClick={() => toggleFavorite(game)}
                className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <Heart
                  className={`w-9 h-9 transition-all ${
                    isFav
                      ? "fill-red-500 text-red-500 scale-110"
                      : "text-gray-400 dark:text-gray-500 hover:text-red-500"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="space-y-5 text-lg bg-gray-50 dark:bg-gray-800/70 p-8 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700">
            {[
              {
                label: "Joueurs",
                value: `${game.minPlayers}–${game.maxPlayers}`,
              },
              {
                label: "Durée",
                value: `${game.minDuration}–${game.maxDuration} min`,
              },
              { label: "Âge", value: `${game.age}+` },
              { label: "Catégories", value: game.categories.join(" • ") },
              { label: "Thèmes", value: game.themes.join(" • ") },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {item.label}
                </span>
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
                {game.price}€
              </span>
              <p className="text-gray-600 dark:text-gray-400">
                prix moyen constaté
              </p>
            </div>
            <button
              onClick={() => toggleFavorite(game)}
              className={`flex items-center gap-3 px-10 py-5 rounded-full text-2xl font-bold transition-all transform hover:scale-105 shadow-xl ${
                isFav
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              <Heart
                className={`w-8 h-8 ${isFav ? "fill-white" : "fill-none"}`}
              />
              {isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-20 max-w-4xl mx-auto space-y-16">
        {game.shortDescription && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Présentation
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              {game.shortDescription}
            </p>
          </section>
        )}

        {game.whyWeLoveIt && game.whyWeLoveIt.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Pourquoi on l’aime
            </h2>
            <ul className="space-y-4 text-lg text-gray-700 dark:text-gray-300">
              {game.whyWeLoveIt.map((point, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="text-indigo-600 dark:text-indigo-400 text-2xl mt-0.5">
                    •
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(game.officialRulesPdf || game.rulesUrl) && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Comment ça se joue
            </h2>
            <a
              href={game.officialRulesPdf || game.rulesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline text-xl font-medium transition-colors"
            >
              <ExternalLink className="w-6 h-6" />
              Télécharger les règles officielles (PDF)
            </a>
          </section>
        )}
      </div>

      {similarGames.length > 0 && (
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Vous aimerez aussi
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {similarGames.map((g) => (
              <div
                key={g.id}
                className="transform hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/jeu/${g.id}`)}
              >
                <GameCard game={g} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
