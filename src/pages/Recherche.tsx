import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import GameCard from "../components/GameCard";
import jeux from "../data/jeux.json";
import { Search, Filter, X, ChevronUp, ChevronDown } from "lucide-react";

export default function Recherche() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Filtres
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedComplexityLevel, setSelectedComplexityLevel] = useState<
    "light" | "medium" | "expert" | null
  >(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPlayerRange, setSelectedPlayerRange] = useState<string | null>(
    null
  );
  const [selectedAgeRange, setSelectedAgeRange] = useState<string | null>(null);

  // Tris
  const [sortPopularity, setSortPopularity] = useState<"asc" | "desc" | null>(
    "desc"
  );
  const [sortPrice, setSortPrice] = useState<"asc" | "desc" | null>(null);
  const [sortDuration, setSortDuration] = useState<"asc" | "desc" | null>(null);

  const navigate = useNavigate();

  const fuzzyMatch = (text: string, search: string): boolean => {
    if (!search) return true;
    const cleanText = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const cleanSearch = search
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (cleanText.includes(cleanSearch)) return true;
    const noDup = cleanSearch.replace(/(.)\1+/g, "$1");
    if (cleanText.includes(noDup)) return true;
    if (
      noDup.length >= 4 &&
      noDup.split("").every((l) => cleanText.includes(l))
    )
      return true;

    if (cleanSearch.length >= 5) {
      let errors = 0,
        i = 0,
        j = 0;
      while (i < cleanSearch.length && j < cleanText.length) {
        if (cleanSearch[i] === cleanText[j]) {
          i++;
          j++;
        } else {
          errors++;
          if (errors > 2) return false;
          if (i < cleanSearch.length - 1 && cleanSearch[i + 1] === cleanText[j])
            i++;
          else if (
            j < cleanText.length - 1 &&
            cleanSearch[i] === cleanText[j + 1]
          )
            j++;
          else {
            i++;
            j++;
          }
        }
      }
      return i >= cleanSearch.length || errors <= 2;
    }
    return false;
  };

  const durationRanges = useMemo(
    () => [
      { id: "short", label: "< 30 min", min: 0, max: 29 },
      { id: "medium", label: "30 – 60 min", min: 30, max: 60 },
      { id: "long", label: "60 – 90 min", min: 61, max: 90 },
      { id: "expert", label: "90+ min", min: 91, max: 999 },
    ],
    []
  );

  const complexityLevels = useMemo(
    () => [
      { id: "light", label: "Léger", min: 1, max: 2 },
      { id: "medium", label: "Moyen", min: 3, max: 3 },
      { id: "expert", label: "Expert", min: 4, max: 5 },
    ],
    []
  );

  const priceRanges = useMemo(
    () => [
      { id: "budget", label: "≤ 25 €", max: 25 },
      { id: "abordable", label: "26 – 40 €", min: 26, max: 40 },
      { id: "standard", label: "41 – 60 €", min: 41, max: 60 },
      { id: "premium", label: "61 – 80 €", min: 61, max: 80 },
      { id: "luxe", label: "80+ €", min: 81, max: 999 },
    ],
    []
  );

  const playerRanges = useMemo(
    () => [
      { id: "solo", label: "1 joueur", min: 1, max: 1 },
      { id: "duo", label: "2 joueurs", min: 2, max: 2 },
      { id: "petit", label: "2-4 joueurs", min: 2, max: 4 },
      { id: "moyen", label: "3-6 joueurs", min: 3, max: 6 },
      { id: "groupe", label: "5-8 joueurs", min: 5, max: 8 },
      { id: "fete", label: "8+ joueurs", min: 8, max: 99 },
    ],
    []
  );

  const ageRanges = useMemo(
    () => [
      { id: "enfant", label: "6-9 ans", min: 6, max: 9 },
      { id: "junior", label: "8-12 ans", min: 8, max: 12 },
      { id: "ado", label: "10-14 ans", min: 10, max: 14 },
      { id: "famille", label: "12+ ans", min: 12, max: 99 },
      { id: "adulte", label: "14+ ans", min: 14, max: 99 },
    ],
    []
  );

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    jeux.forEach((game) => game.categories.forEach((c) => cats.add(c)));
    return Array.from(cats).sort();
  }, []);

  const matchesPlayerRange = (
    game: (typeof jeux)[0],
    rangeId: string | null
  ): boolean => {
    if (!rangeId) return true;
    const range = playerRanges.find((r) => r.id === rangeId);
    if (!range) return true;
    if (range.id === "solo") return game.minPlayers === 1;
    if (range.id === "duo") return game.minPlayers <= 2 && game.maxPlayers >= 2;
    return game.minPlayers <= range.max && game.maxPlayers >= range.min;
  };

  const matchesAgeRange = (
    gameAge: number,
    rangeId: string | null
  ): boolean => {
    if (!rangeId) return true;
    const range = ageRanges.find((r) => r.id === rangeId);
    if (!range) return true;
    if (range.id === "famille") return gameAge >= 12;
    if (range.id === "adulte") return gameAge >= 14;
    return gameAge >= range.min && gameAge <= range.max;
  };

  const getFilteredGamesIgnoring = useMemo(() => {
    return (
      ignoreFilter:
        | "duration"
        | "complexity"
        | "price"
        | "players"
        | "age"
        | "categories"
        | null = null
    ) => {
      return jeux.filter((game) => {
        const matchesSearch =
          !searchTerm ||
          fuzzyMatch(game.title, searchTerm) ||
          game.categories.some((c) => fuzzyMatch(c, searchTerm)) ||
          game.themes.some((t) => fuzzyMatch(t, searchTerm));

        const matchesDuration =
          ignoreFilter === "duration" ||
          !selectedDuration ||
          durationRanges.some(
            (r) =>
              r.id === selectedDuration &&
              game.maxDuration >= r.min &&
              game.maxDuration <= r.max
          );

        const matchesComplexity =
          ignoreFilter === "complexity" ||
          !selectedComplexityLevel ||
          complexityLevels.some(
            (l) =>
              l.id === selectedComplexityLevel &&
              game.complexity >= l.min &&
              game.complexity <= l.max
          );

        const matchesPrice =
          ignoreFilter === "price" ||
          !selectedPriceRange ||
          (() => {
            const range = priceRanges.find((r) => r.id === selectedPriceRange);
            if (!range) return true;
            if (range.min !== undefined)
              return game.price >= range.min && game.price <= range.max;
            return game.price <= range.max;
          })();

        const matchesPlayers =
          ignoreFilter === "players" ||
          !selectedPlayerRange ||
          matchesPlayerRange(game, selectedPlayerRange);

        const matchesAge =
          ignoreFilter === "age" ||
          !selectedAgeRange ||
          matchesAgeRange(game.age, selectedAgeRange);

        const matchesCategories =
          ignoreFilter === "categories" ||
          selectedCategories.length === 0 ||
          game.categories.some((c) => selectedCategories.includes(c));

        return (
          matchesSearch &&
          matchesDuration &&
          matchesComplexity &&
          matchesPrice &&
          matchesPlayers &&
          matchesAge &&
          matchesCategories
        );
      });
    };
  }, [
    searchTerm,
    selectedDuration,
    selectedComplexityLevel,
    selectedPriceRange,
    selectedPlayerRange,
    selectedAgeRange,
    selectedCategories,
  ]);

  const filteredGames = useMemo(
    () => getFilteredGamesIgnoring(null),
    [getFilteredGamesIgnoring]
  );

  const durationCounts = useMemo(() => {
    const games = getFilteredGamesIgnoring("duration");
    const counts: Record<string, number> = {};
    durationRanges.forEach((r) => {
      counts[r.id] = games.filter(
        (g) => g.maxDuration >= r.min && g.maxDuration <= r.max
      ).length;
    });
    return counts;
  }, [getFilteredGamesIgnoring]);

  const complexityCounts = useMemo(() => {
    const games = getFilteredGamesIgnoring("complexity");
    const counts: Record<string, number> = {};
    complexityLevels.forEach((l) => {
      counts[l.id] = games.filter(
        (g) => g.complexity >= l.min && g.complexity <= l.max
      ).length;
    });
    return counts;
  }, [getFilteredGamesIgnoring]);

  const priceRangeCounts = useMemo(() => {
    const games = getFilteredGamesIgnoring("price");
    const counts: Record<string, number> = {};
    priceRanges.forEach((r) => {
      counts[r.id] = games.filter((g) => {
        if (r.min !== undefined) return g.price >= r.min && g.price <= r.max;
        return g.price <= r.max;
      }).length;
    });
    return counts;
  }, [getFilteredGamesIgnoring]);

  const playerRangeCounts = useMemo(() => {
    const games = getFilteredGamesIgnoring("players");
    const counts: Record<string, number> = {};
    playerRanges.forEach((r) => {
      counts[r.id] = games.filter((g) => matchesPlayerRange(g, r.id)).length;
    });
    return counts;
  }, [getFilteredGamesIgnoring]);

  const ageRangeCounts = useMemo(() => {
    const games = getFilteredGamesIgnoring("age");
    const counts: Record<string, number> = {};
    ageRanges.forEach((r) => {
      counts[r.id] = games.filter((g) => matchesAgeRange(g.age, r.id)).length;
    });
    return counts;
  }, [getFilteredGamesIgnoring]);

  const categoryCounts = useMemo(() => {
    const games = getFilteredGamesIgnoring("categories");
    const counts: Record<string, number> = {};
    allCategories.forEach((cat) => (counts[cat] = 0));
    games.forEach((game) => {
      game.categories.forEach((cat) => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, [getFilteredGamesIgnoring]);

  const getSmartSuggestions = useCallback(() => {
    let candidates: typeof jeux = [];

    if (searchTerm) {
      candidates = jeux
        .filter(
          (g) =>
            fuzzyMatch(g.title, searchTerm) ||
            g.categories.some((c) => fuzzyMatch(c, searchTerm)) ||
            g.themes.some((t) => fuzzyMatch(t, searchTerm))
        )
        .sort(
          (a, b) =>
            (fuzzyMatch(b.title, searchTerm) ? 1 : 0) -
            (fuzzyMatch(a.title, searchTerm) ? 1 : 0)
        );
      if (candidates.length >= 8) return candidates.slice(0, 8);
    }

    const relaxOrder = [
      "categories",
      "duration",
      "complexity",
      "players",
      "age",
      "price",
    ] as const;

    for (const filter of relaxOrder) {
      const active =
        (filter === "categories" && selectedCategories.length > 0) ||
        (filter === "duration" && selectedDuration) ||
        (filter === "complexity" && selectedComplexityLevel) ||
        (filter === "price" && selectedPriceRange) ||
        (filter === "players" && selectedPlayerRange) ||
        (filter === "age" && selectedAgeRange);

      if (!active) continue;

      const relaxed = getFilteredGamesIgnoring(filter);
      const newOnes = relaxed.filter(
        (g) => !candidates.some((c) => c.id === g.id)
      );
      candidates.push(...newOnes);
      if (candidates.length >= 12) break;
    }

    const scored = candidates.map((game) => {
      let score = game.popularity / 10;
      if (searchTerm && fuzzyMatch(game.title, searchTerm)) score += 150;
      if (selectedCategories.length > 0) {
        score +=
          game.categories.filter((c) => selectedCategories.includes(c)).length *
          40;
      }
      return { game, score };
    });

    const result = scored.sort((a, b) => b.score - a.score).map((i) => i.game);

    if (result.length < 8) {
      const needed = 8 - result.length;
      result.push(
        ...jeux
          .filter((g) => !result.some((r) => r.id === g.id))
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, needed)
      );
    }
    return result.slice(0, 8);
  }, [
    searchTerm,
    selectedCategories,
    selectedDuration,
    selectedComplexityLevel,
    selectedPriceRange,
    selectedPlayerRange,
    selectedAgeRange,
    getFilteredGamesIgnoring,
  ]);

  const filteredAndSortedGames = useMemo(() => {
    const sorted = [...filteredGames];
    sorted.sort((a, b) => {
      if (sortPopularity) {
        const diff =
          sortPopularity === "desc"
            ? b.popularity - a.popularity
            : a.popularity - b.popularity;
        if (diff !== 0) return diff;
      }
      if (sortPrice) {
        const diff =
          sortPrice === "asc" ? a.price - b.price : b.price - a.price;
        if (diff !== 0) return diff;
      }
      if (sortDuration) {
        const diff =
          sortDuration === "asc"
            ? a.minDuration - b.minDuration
            : b.minDuration - a.minDuration;
        if (diff !== 0) return diff;
      }
      return 0;
    });
    return sorted;
  }, [filteredGames, sortPopularity, sortPrice, sortDuration]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDuration(null);
    setSelectedComplexityLevel(null);
    setSelectedPriceRange(null);
    setSelectedPlayerRange(null);
    setSelectedAgeRange(null);
    setSelectedCategories([]);
  };

  const resetSort = () => {
    setSortPopularity("desc");
    setSortPrice(null);
    setSortDuration(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Barre de recherche */}
      <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-6 h-6" />
              <input
                type="text"
                placeholder="Rechercher un jeu, catégorie, thème... (même mal orthographié !)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 text-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
              />
            </div>
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="lg:hidden flex items-center gap-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition shadow-lg"
            >
              <Filter className="w-5 h-5" />
              <span>Filtres</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar filtres */}
          <aside
            className={`fixed inset-0 z-50 w-80 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out lg:relative lg:inset-auto lg:z-auto lg:shadow-lg lg:rounded-xl lg:block lg:w-80 border-r border-gray-200 dark:border-gray-700 ${
              isFiltersOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="p-6 h-full overflow-y-auto lg:max-h-[calc(100vh-10rem)] lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Filtres
                </h2>
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Durée */}
                <div>
                  <h3 className="font-semibold mb-4 text-lg text-gray-900 dark:text-white">
                    Durée de partie
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {durationRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() =>
                          setSelectedDuration(
                            selectedDuration === range.id ? null : range.id
                          )
                        }
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          selectedDuration === range.id
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                        }`}
                      >
                        <div>{range.label}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {durationCounts[range.id] || 0} jeu
                          {(durationCounts[range.id] || 0) > 1 ? "x" : ""}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Complexité */}
                <div>
                  <h3 className="font-semibold mb-4 text-lg text-gray-900 dark:text-white">
                    Complexité
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {complexityLevels.map((level) => {
                      const isSelected = selectedComplexityLevel === level.id;
                      const bg =
                        level.id === "light"
                          ? "bg-green-500"
                          : level.id === "medium"
                          ? "bg-yellow-500"
                          : "bg-red-500";
                      return (
                        <button
                          key={level.id}
                          onClick={() =>
                            setSelectedComplexityLevel(
                              isSelected ? null : (level.id as any)
                            )
                          }
                          className={`relative px-4 py-3 rounded-full text-sm font-bold text-white shadow-lg transition-all transform hover:scale-105 ${bg} ${
                            isSelected
                              ? "ring-4 ring-indigo-400 ring-offset-2 dark:ring-offset-gray-800"
                              : "opacity-90"
                          }`}
                        >
                          <div className="text-center">
                            <div>{level.label}</div>
                            <div className="text-xs font-normal opacity-90 mt-0.5">
                              {complexityCounts[level.id] || 0} jeu
                              {(complexityCounts[level.id] || 0) > 1 ? "x" : ""}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Prix */}
                <div>
                  <h3 className="font-semibold mb-4 text-lg text-gray-900 dark:text-white">
                    Prix
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {priceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() =>
                          setSelectedPriceRange(
                            selectedPriceRange === range.id ? null : range.id
                          )
                        }
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          selectedPriceRange === range.id
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                        }`}
                      >
                        <div>{range.label}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {priceRangeCounts[range.id] || 0} jeu
                          {(priceRangeCounts[range.id] || 0) > 1 ? "x" : ""}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Joueurs */}
                <div>
                  <h3 className="font-semibold mb-4 text-lg text-gray-900 dark:text-white">
                    Nombre de joueurs
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {playerRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() =>
                          setSelectedPlayerRange(
                            selectedPlayerRange === range.id ? null : range.id
                          )
                        }
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          selectedPlayerRange === range.id
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                        }`}
                      >
                        <div>{range.label}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {playerRangeCounts[range.id] || 0} jeu
                          {(playerRangeCounts[range.id] || 0) > 1 ? "x" : ""}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Âge */}
                <div>
                  <h3 className="font-semibold mb-4 text-lg text-gray-900 dark:text-white">
                    Âge recommandé
                  </h3>
                  <div className="space-y-3">
                    {ageRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() =>
                          setSelectedAgeRange(
                            selectedAgeRange === range.id ? null : range.id
                          )
                        }
                        className={`w-full px-4 py-3 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                          selectedAgeRange === range.id
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{range.label}</span>
                          <span className="text-xs opacity-70">
                            {ageRangeCounts[range.id] || 0} jeu
                            {(ageRangeCounts[range.id] || 0) > 1 ? "x" : ""}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Catégories */}
                <div>
                  <h3 className="font-semibold mb-4 text-lg text-gray-900 dark:text-white">
                    Catégories
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {allCategories.map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="w-5 h-5 text-indigo-600 dark:text-indigo-400 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        />
                        <span className="flex-1 text-gray-800 dark:text-gray-200">
                          {cat}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({categoryCounts[cat] || 0})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={resetFilters}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            </div>
          </aside>

          {/* Overlay mobile */}
          {isFiltersOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsFiltersOpen(false)}
            />
          )}

          {/* Résultats */}
          <div className="flex-1">
            <div className="mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {filteredAndSortedGames.length} jeu
                  {filteredAndSortedGames.length > 1 ? "x" : ""} trouvé
                  {filteredAndSortedGames.length > 1 ? "s" : ""}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Tri Popularité */}
                  <button
                    onClick={() =>
                      setSortPopularity((p) =>
                        p === "desc" ? "asc" : p === "asc" ? null : "desc"
                      )
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition ${
                      sortPopularity
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    Popularité{" "}
                    {sortPopularity === "desc" && (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    {sortPopularity === "asc" && (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>

                  {/* Tri Prix */}
                  <button
                    onClick={() =>
                      setSortPrice((p) =>
                        p === "desc" ? "asc" : p === "asc" ? null : "desc"
                      )
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition ${
                      sortPrice
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    Prix{" "}
                    {sortPrice === "desc" && (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    {sortPrice === "asc" && <ChevronUp className="w-4 h-4" />}
                  </button>

                  {/* Tri Durée */}
                  <button
                    onClick={() =>
                      setSortDuration((p) =>
                        p === "desc" ? "asc" : p === "asc" ? null : "desc"
                      )
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition ${
                      sortDuration
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    Durée{" "}
                    {sortDuration === "desc" && (
                      <ChevronDown className="w-4 h-4" />
                    )}
                    {sortDuration === "asc" && (
                      <ChevronUp className="w-4 h-4" />
                    )}
                  </button>

                  {(sortPopularity !== "desc" || sortPrice || sortDuration) && (
                    <button
                      onClick={resetSort}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
                    >
                      Réinitialiser le tri
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Résultats ou suggestions */}
            {filteredAndSortedGames.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Aucun résultat exact… mais on a deviné ce que vous cherchiez !
                </p>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
                  Voici les jeux les plus proches :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {getSmartSuggestions().map((game) => (
                    <div key={game.id} className="relative group">
                      <GameCard
                        game={game}
                        onClick={() => navigate(`/jeu/${game.id}`)}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-12">
                  <button
                    onClick={resetFilters}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium text-lg"
                  >
                    Réinitialiser tous les filtres
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredAndSortedGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onClick={() => navigate(`/jeu/${game.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
