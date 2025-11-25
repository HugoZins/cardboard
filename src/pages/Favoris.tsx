import { useState, useEffect } from "react";
import { useFavorites } from "../hooks/useFavorites";
import GameCard from "../components/GameCard";
import { useNavigate } from "react-router-dom";
import { Download, Heart, Trash2 } from "lucide-react";

export default function Favoris() {
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const [gameToRemove, setGameToRemove] = useState<number | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openConfirmModal = (gameId: number) => setGameToRemove(gameId);
  const closeModal = () => setGameToRemove(null);

  const confirmRemove = () => {
    if (gameToRemove !== null) {
      const game = favorites.find((g) => g.id === gameToRemove);
      if (game) toggleFavorite(game);
      setGameToRemove(null);
    }
  };

  const confirmClearAll = () => {
    favorites.forEach((game) => toggleFavorite(game));
    setShowClearAllModal(false);
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(79, 70, 229);
      doc.text("Mes jeux favoris", 105, 25, { align: "center" });

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Exporté le ${new Date().toLocaleDateString(
          "fr-FR"
        )} à ${new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        105,
        35,
        { align: "center" }
      );

      autoTable(doc, {
        head: [["Jeu", "Joueurs", "Durée", "Âge", "Prix"]],
        body: favorites.map((game) => [
          game.title,
          `${game.minPlayers}–${game.maxPlayers}`,
          `${game.minDuration}–${game.maxDuration} min`,
          `${game.age}+`,
          `${game.price}€`,
        ]),
        startY: 50,
        theme: "grid",
        headStyles: { fillColor: [79, 70, 229], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 8 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 30, halign: "center" },
          2: { cellWidth: 30, halign: "center" },
          3: { cellWidth: 20, halign: "center" },
          4: { halign: "right" },
        },
      });

      doc.save(`mes-favoris-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("Erreur PDF :", err);
      alert("Erreur lors de la génération du PDF");
    } finally {
      setTimeout(() => setIsExporting(false), 600);
    }
  };

  const gameBeingRemoved =
    gameToRemove !== null ? favorites.find((g) => g.id === gameToRemove) : null;

  if (favorites.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Heart className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-200 mb-4">
          Aucun favori pour le moment
        </h2>
        <p className="text-xl text-gray-500 dark:text-gray-400">
          Ajoutez des jeux en cliquant sur le cœur
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        Mes jeux favoris ({favorites.length})
      </h1>

      {/* Barre d’actions fixe */}
      <div
        className={`flex flex-col sm:flex-row gap-4 justify-center items-center py-6 rounded-2xl border transition-all duration-300 ${
          isScrolled
            ? "fixed top-16 left-0 right-0 z-40 mx-4 shadow-2xl backdrop-blur-xl bg-white/90 dark:bg-gray-800/95 border-gray-200 dark:border-gray-700"
            : "relative bg-white dark:bg-gray-800/90 border-gray-200 dark:border-gray-700"
        }`}
      >
        <button
          onClick={exportToPDF}
          disabled={isExporting}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white rounded-xl shadow-lg font-medium text-lg transition"
        >
          {isExporting ? (
            <>
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <Download className="w-6 h-6" />
              Exporter en PDF
            </>
          )}
        </button>

        <button
          onClick={() => setShowClearAllModal(true)}
          className="flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg font-medium text-lg transition"
        >
          <Trash2 className="w-6 h-6" />
          Vider tous les favoris
        </button>
      </div>

      <div className={isScrolled ? "pt-36" : "pt-8"} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        {favorites.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onClick={() => navigate(`/jeu/${game.id}`)}
            onRemoveFromFavorites={() => openConfirmModal(game.id)}
          />
        ))}
      </div>

      {/* Modales */}
      {gameToRemove !== null && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeModal}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full">
                  <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Retirer des favoris ?
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Êtes-vous sûr de vouloir retirer <br />
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-lg">
                  {gameBeingRemoved?.title}
                </span>{" "}
                ?
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmRemove}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition"
                >
                  <Trash2 className="w-5 h-5" /> Retirer
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {showClearAllModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowClearAllModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full">
                  <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Vider tous les favoris ?
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Êtes-vous <strong>sûr</strong> de vouloir retirer{" "}
                <span className="text-red-600 dark:text-red-400 font-bold">
                  {favorites.length} jeu{favorites.length > 1 ? "x" : ""}
                </span>{" "}
                ?<br />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Action irréversible.
                </span>
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowClearAllModal(false)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmClearAll}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition"
                >
                  <Trash2 className="w-5 h-5" /> Tout vider
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
