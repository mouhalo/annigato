# 🎂 ANNIGATO - Application de Création de Gâteaux d'Anniversaire

> **Application web ludique et sécurisée permettant aux enfants de 6-13 ans de concevoir, personnaliser et commander des gâteaux d'anniversaire avec génération d'images par IA.**

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.16.0-green.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.8.3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Table des Matières

- [Vision du Projet](#-vision-du-projet)
- [État Actuel](#-état-actuel)
- [Choix Technologiques](#-choix-technologiques)
- [Installation](#-installation)
- [Architecture](#-architecture)
- [Fonctionnalités](#-fonctionnalités)
- [Roadmap](#-roadmap)
- [Contribution](#-contribution)

## 🎯 Vision du Projet

Annigato est une plateforme innovante qui révolutionne la façon dont les enfants commandent leurs gâteaux d'anniversaire. En combinant une interface ludique adaptée à l'âge, la puissance de l'IA générative et un système de contrôle parental robuste, nous créons une expérience magique et sécurisée.

### Objectifs Principaux

1. **Simplicité** : Interface intuitive adaptée aux enfants avec deux modes (6-9 ans et 10-13 ans)
2. **Sécurité** : Contrôle parental intégré à chaque étape critique
3. **Créativité** : Outils de personnalisation stimulants avec génération d'images IA
4. **Accessibilité** : Application 100% responsive (mobile-first)

## 📊 État Actuel

### ✅ Réalisations (Phase 0 - Configuration)

- [x] **Migration de Create React App vers Vite**
  - Performance de build améliorée (démarrage < 1s)
  - Hot Module Replacement (HMR) instantané
  - Configuration TypeScript optimisée

- [x] **Architecture Redux moderne**
  - Redux Toolkit configuré avec 3 slices principaux
  - Hooks typés (`useAppSelector`, `useAppDispatch`)
  - Structure modulaire par feature

- [x] **Interface Responsive Mobile-First**
  - Homepage entièrement responsive
  - Breakpoints cohérents (sm: 640px, md: 768px, lg: 1024px)
  - Touch-friendly avec zones de tap ≥ 44px

- [x] **Système de Design**
  - TailwindCSS v4 intégré
  - Animations personnalisées
  - Palette de couleurs enfantine

### 🚧 En Cours

- [ ] Configuration PostgreSQL + Prisma
- [ ] Design system complet (composants de base)
- [ ] Tests unitaires et E2E
- [ ] CI/CD avec GitHub Actions

## 🛠️ Choix Technologiques

### Frontend

| Technologie | Version | Justification |
|------------|---------|---------------|
| **React** | 18.2.0 | Framework moderne avec Suspense et Concurrent features |
| **TypeScript** | 5.8.3 | Type-safety essentielle pour un projet d'équipe |
| **Vite** | 7.0.3 | Build ultra-rapide et meilleure DX que CRA |
| **Redux Toolkit** | 2.8.2 | State management simplifié avec best practices intégrées |
| **TailwindCSS** | 4.1.11 | Développement rapide avec classes utilitaires |
| **React Router** | 6.30.1 | Routing moderne avec support des loaders |
| **Lucide React** | 0.525.0 | Icônes modernes et légères |

### Backend (Prévu)

| Technologie | Justification |
|------------|---------------|
| **Node.js + Express** | API REST performante et écosystème mature |
| **Prisma ORM** | Type-safety et migrations automatiques |
| **PostgreSQL** | Base relationnelle robuste pour données structurées |
| **JWT** | Authentification stateless sécurisée |
| **Bull Queue** | Gestion asynchrone pour génération d'images |

### APIs Externes

- **Pollinations.ai** : Génération d'images de gâteaux par IA
- **WhatsApp Business API** : Envoi d'invitations

## 🚀 Installation

### Prérequis

- Node.js >= 20.16.0
- npm >= 10.8.1
- Git

### Installation du Projet

```bash
# Cloner le repository
git clone https://github.com/votre-username/annigato.git
cd annigato

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env

# Lancer en développement
npm run dev
```

L'application sera accessible sur http://localhost:3000

### Scripts Disponibles

```bash
npm run dev          # Lancer le serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run lint         # Vérifier le TypeScript
```

## 🏗️ Architecture

### Structure des Dossiers

```
annigato/
├── src/
│   ├── components/          # Composants réutilisables
│   │   └── ui/             # Composants UI de base
│   ├── features/           # Modules métier (Redux slices)
│   │   ├── auth/          # Authentification parent/enfant
│   │   ├── cart/          # Gestion du panier
│   │   └── cakes/         # Catalogue et créations
│   ├── pages/             # Pages de l'application
│   │   ├── AnnigatoHomePage.tsx
│   │   └── EspaceParentPage.tsx
│   ├── hooks/             # Custom hooks
│   ├── store/             # Configuration Redux
│   │   ├── store.ts       # Store principal
│   │   ├── hooks.ts       # Hooks typés
│   │   └── index.ts       # Exports centralisés
│   ├── services/          # Services API
│   ├── styles/            # Styles globaux
│   └── utils/             # Utilitaires
├── server/                # Backend Express (à venir)
├── prisma/                # Schémas base de données
├── public/                # Assets statiques
└── docs/                  # Documentation projet
```

### Architecture Redux

```typescript
// Structure du State
{
  auth: {
    user: User | null,
    activeChild: ChildProfile | null,
    isAuthenticated: boolean
  },
  cart: {
    items: CartCake[],
    totalAmount: number,
    isOpen: boolean
  },
  cakes: {
    catalog: Cake[],
    userCreations: CakeCreation[],
    currentCreation: CakeCreation | null
  }
}
```

## 🎨 Fonctionnalités

### Implémentées

- **Page d'accueil responsive**
  - Carrousel de gâteaux animé
  - Filtrage par catégorie
  - Système de likes
  - Navigation adaptative mobile/desktop

- **Gestion d'état globale**
  - Panier avec toggle
  - Favoris persistants
  - Sélection de catégorie

### En Développement

- **Module de Création** (Mode guidé 6-9 ans)
  - [ ] Choix de la base (forme + taille)
  - [ ] Sélection des saveurs
  - [ ] Décorations par glisser-déposer
  - [ ] Génération IA

- **Espace Parent**
  - [ ] Dashboard des commandes
  - [ ] Contrôles de sécurité
  - [ ] Gestion des profils enfants

## 📅 Roadmap

### Phase 1 - Fondations (En cours)
- Configuration complète de l'environnement ✅
- Design system et composants de base 🚧
- Architecture backend
- Tests unitaires

### Phase 2 - Module Création (À venir)
- Interface de création guidée
- Intégration Pollinations.ai
- Système de sauvegarde
- Preview en temps réel

### Phase 3 - Module Commande
- Flux de commande sécurisé
- Vérification parentale
- Notifications email

### Phase 4 - Module Social
- Invitations WhatsApp
- Partage de créations
- Galerie communautaire

### Phase 5 - Optimisation UX
- Mode 6-8 ans complet
- Tutoriels interactifs
- Gamification

### Phase 6 - Production
- Déploiement cloud
- Monitoring
- Support multilingue

## 🔧 Configuration Avancée

### Variables d'Environnement

```env
# Application
VITE_APP_TITLE=Annigato
VITE_API_URL=http://localhost:5000/api

# APIs Externes
VITE_POLLINATIONS_API_URL=https://image.pollinations.ai/prompt/
VITE_WHATSAPP_API_KEY=your_key

# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/annigato_db
```

### Conventions de Code

```typescript
// Composants : PascalCase avec interface Props
interface ButtonProps {
  variant: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
}

export const Button: FC<ButtonProps> = ({ variant, size = 'medium' }) => {
  // Implementation
}

// Commits : Conventional Commits
feat: ajouter module de création
fix: corriger responsive mobile
docs: mettre à jour README
```

## 🤝 Contribution

### Workflow Git

1. Créer une branche depuis `develop`
```bash
git checkout -b feature/nom-feature
```

2. Commiter avec message conventionnel
```bash
git commit -m "feat: description de la feature"
```

3. Push et créer une PR vers `develop`

### Standards de Qualité

- Coverage de tests > 80%
- Pas de `any` TypeScript
- Composants documentés
- Code review obligatoire

## 📞 Support & Contact

- **Documentation** : [docs/](./docs)
- **Issues** : [GitHub Issues](https://github.com/votre-username/annigato/issues)
- **Email** : contact@annigato.com

## 📄 License

Ce projet est sous license MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---

<div align="center">
  <p>Fait avec ❤️ pour les enfants et leurs anniversaires magiques</p>
  <p>
    <a href="#-annigato---application-de-création-de-gâteaux-danniversaire">Retour en haut ↑</a>
  </p>
</div>
