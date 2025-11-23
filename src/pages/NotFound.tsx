import { useNavigate } from "react-router-dom";
import { Home, Search, AlertTriangle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icône d'erreur stylisée */}
        <div className="mb-8">
          <div className="mx-auto w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-16 h-16 text-indigo-600" />
          </div>
        </div>

        {/* Titre 404 */}
        <h1 className="text-9xl font-bold text-gray-800 mb-4">404</h1>

        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Oups ! Page non trouvée
        </h2>

        <p className="text-xl text-gray-600 mb-10">
          La page que vous cherchez a peut-être été déplacée, supprimée, ou n'a
          jamais existé… un peu comme le dernier exemplaire de Gloomhaven en
          boutique !
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition shadow-lg"
          >
            <Home className="w-6 h-6" />
            Retour à l'accueil
          </button>

          <button
            onClick={() => navigate("/recherche")}
            className="inline-flex items-center gap-3 bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-50 transition shadow-lg"
          >
            <Search className="w-6 h-6" />
            Chercher un jeu
          </button>
        </div>

        {/* Petite touche d'humour en bas */}
        <p className="mt-12 text-sm text-gray-500">
          Si vous pensez que c'est une erreur, c'est probablement la faute du
          panda de Takenoko.
        </p>
      </div>
    </div>
  );
}
