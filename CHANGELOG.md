# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-01-09

### 🎉 Version Initiale - Phase 0 : Configuration

#### Ajouté
- **Infrastructure Frontend**
  - Migration de Create React App vers Vite 7.0.3
  - Configuration TypeScript 5.8.3 avec strict mode
  - Support des modules ES avec chemins absolus (@/)
  
- **State Management**
  - Redux Toolkit avec architecture modulaire
  - 3 slices principaux : `auth`, `cart`, `cakes`
  - Hooks Redux typés pour TypeScript
  - Actions et sélecteurs centralisés

- **Interface Utilisateur**
  - Homepage responsive mobile-first
  - Carrousel de gâteaux animé avec auto-play
  - Système de filtrage par catégorie
  - Animations CSS personnalisées (float, pulse, confetti)
  - Logo SVG animé avec gradient

- **Styling**
  - TailwindCSS v4 avec PostCSS
  - Design system avec couleurs personnalisées
  - Breakpoints cohérents (sm: 640px, md: 768px, lg: 1024px)
  - Support du mode sombre (prévu)

- **Routing**
  - React Router v6 configuré
  - Routes de base : Home, Espace Parent
  - Support des routes protégées (prévu)

- **Documentation**
  - README.md complet avec badges
  - Documentation de l'architecture
  - Guide d'installation détaillé
  - Roadmap en 6 phases

#### Changé
- Build tooling : CRA → Vite (temps de démarrage 10x plus rapide)
- Structure des dossiers : organisation par features
- Imports : chemins relatifs → alias (@/)

#### Technique
- Node.js 20.16.0
- React 18.2.0
- Redux Toolkit 2.8.2
- TailwindCSS 4.1.11
- Vite 7.0.3

---

## [Unreleased]

### 🚧 En Développement

#### À Venir (Phase 1 - Fondations)
- [ ] Configuration PostgreSQL avec Prisma ORM
- [ ] Composants UI de base (Button, Card, Input, Modal)
- [ ] Authentification JWT avec refresh tokens
- [ ] Tests unitaires avec Jest et React Testing Library
- [ ] CI/CD avec GitHub Actions
- [ ] Storybook pour la documentation des composants
- [ ] Internationalisation (i18n)

#### Prévu (Phase 2 - Module Création)
- [ ] Interface de création guidée pour enfants
- [ ] Intégration API Pollinations.ai
- [ ] Preview en temps réel des gâteaux
- [ ] Sauvegarde automatique des créations

---

## Convention des Versions

- **MAJOR** (X.0.0) : Changements incompatibles avec les versions précédentes
- **MINOR** (0.X.0) : Nouvelles fonctionnalités compatibles
- **PATCH** (0.0.X) : Corrections de bugs compatibles

## Liens

- [Comparer les versions](https://github.com/votre-username/annigato/compare)
- [Tags des releases](https://github.com/votre-username/annigato/tags)
