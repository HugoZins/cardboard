import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home"; 
import Recherche from "./pages/Recherche";
import Favoris from "./pages/Favoris";
import JeuDetail from "./pages/JeuDetail";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/recherche" element={<Recherche />} />
        <Route path="/favoris" element={<Favoris />} />
        <Route path="/jeu/:id" element={<JeuDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
