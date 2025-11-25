# CardBoard — Catalogue de jeux de société

**Projet réalisé dans le cadre du TP UX/UI Design – Master 1**  
Recherche, filtrage et découverte de jeux de société pour un public non expert.

Live demo : https://hugozins.github.io/cardboard/

## Contexte du projet

Ce site répond à un énoncé de cours centré sur **l’expérience utilisateur** autour d’un catalogue de données structurées.  
Objectif : permettre à un **utilisateur lambda** (famille, étudiant, joueur occasionnel) de trouver rapidement le jeu de société idéal selon ses contraintes (nombre de joueurs, durée, âge, budget…).

Dataset : 25 jeux de société réels avec données riches (durée, joueurs, complexité, catégories, thèmes, prix, popularité…).

## Fonctionnalités implémentées

- Recherche textuelle intelligente avec **fuzzy matching** (tolère les fautes d’orthographe)
- **Suggestions intelligentes** quand aucun résultat exact → évite la frustration
- Filtres puissants : durée, nombre de joueurs, âge, complexité, prix, catégories
- Tri multiple : popularité, prix, durée
- Système de **favoris** persistant (localStorage)
- Mode sombre complet avec transitions fluides
- Design responsive (mobile-first)
- Navigation fluide avec React Router
- Fiches détaillées riches + badge complexité + jeux similaires

## Technologies utilisées

- React 18 + TypeScript
- Vite (build ultra-rapide)
- Tailwind CSS
- React Router v6
- Lucide React (icônes)
- localStorage pour les favoris
- Hébergement : GitHub Pages

## Points UX forts

- Aucune page blanche grâce aux suggestions intelligentes
- Filtres progressifs avec compteurs en temps réel
- Interface claire et épurée (inspirée BoardGameGeek / Philibert)
- Mode sombre soigné (transitions, images adaptées)
- Accessibilité & performance optimisées

## Installation & lancement local

```bash
git clone https://github.com/HugoZins/cardboard.git
cd cardboard
npm install
npm run dev
→ Ouvre http://localhost:5173

Déploiement
Le site est automatiquement déployé sur GitHub Pages à chaque push sur main
Base path géré automatiquement (/ en local → /cardboard/ en prod)

Auteur
Hugo Zins — Master 1

Projet validé dans le cadre du cours UX/UI Design (recherche, filtrage, data)
“Trouver le bon jeu de société n’a jamais été aussi simple.”