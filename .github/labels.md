# Configuration des Labels GitHub pour Annigato

## 🏷️ Labels de Type
- `bug` - Quelque chose ne fonctionne pas correctement (rouge #d73a4a)
- `enhancement` - Nouvelle fonctionnalité ou amélioration (vert clair #a2eeef)
- `documentation` - Améliorations ou ajouts à la documentation (bleu #0075ca)
- `duplicate` - Cette issue ou PR existe déjà (gris #cfd3d7)
- `invalid` - Ceci ne semble pas correct (gris #e4e669)
- `question` - Besoin d'informations supplémentaires (rose #d876e3)

## 🎯 Labels de Priorité
- `priority: critical` - Doit être traité immédiatement (rouge foncé #b60205)
- `priority: high` - Important, à traiter rapidement (orange #ff9800)
- `priority: medium` - Priorité normale (jaune #ffeb3b)
- `priority: low` - Peut attendre (vert pâle #c5def5)

## 📦 Labels de Module
- `module: auth` - Authentification et sécurité (violet #7057ff)
- `module: creation` - Module de création de gâteaux (rose #ff69b4)
- `module: cart` - Panier et commandes (bleu #1d76db)
- `module: social` - Fonctionnalités sociales (vert #0e8a16)
- `module: ui` - Interface utilisateur (orange #fb8c00)

## 🔧 Labels de Status
- `needs-triage` - À évaluer par l'équipe (jaune pâle #fef2c0)
- `in-progress` - Travail en cours (bleu clair #2196f3)
- `ready-for-review` - Prêt pour review (vert #4caf50)
- `blocked` - Bloqué par une dépendance (rouge #f44336)

## 👥 Labels d'Équipe
- `good-first-issue` - Bon pour les nouveaux contributeurs (vert #7057ff)
- `help-wanted` - Aide externe bienvenue (vert #008672)
- `wontfix` - Ceci ne sera pas travaillé (blanc #ffffff)

## 🌐 Labels de Plateforme
- `platform: mobile` - Spécifique au mobile (bleu mobile #0052cc)
- `platform: desktop` - Spécifique au desktop (gris #607d8b)
- `platform: all` - Toutes les plateformes (violet #9c27b0)

## 📋 Script d'Installation

Pour installer ces labels via GitHub CLI :

```bash
# Installation des labels de type
gh label create "bug" --description "Quelque chose ne fonctionne pas" --color "d73a4a"
gh label create "enhancement" --description "Nouvelle fonctionnalité" --color "a2eeef"
gh label create "documentation" --description "Documentation" --color "0075ca"

# Installation des labels de priorité
gh label create "priority: critical" --description "Urgent" --color "b60205"
gh label create "priority: high" --description "Important" --color "ff9800"
gh label create "priority: medium" --description "Normal" --color "ffeb3b"
gh label create "priority: low" --description "Peut attendre" --color "c5def5"

# Installation des labels de module
gh label create "module: auth" --description "Authentification" --color "7057ff"
gh label create "module: creation" --description "Création de gâteaux" --color "ff69b4"
gh label create "module: cart" --description "Panier" --color "1d76db"
gh label create "module: social" --description "Social" --color "0e8a16"
gh label create "module: ui" --description "Interface" --color "fb8c00"

# Installation des labels de status
gh label create "needs-triage" --description "À évaluer" --color "fef2c0"
gh label create "in-progress" --description "En cours" --color "2196f3"
gh label create "ready-for-review" --description "À reviewer" --color "4caf50"
gh label create "blocked" --description "Bloqué" --color "f44336"

# Installation des labels d'équipe
gh label create "good-first-issue" --description "Bon début" --color "7057ff"
gh label create "help-wanted" --description "Aide bienvenue" --color "008672"
```
