# 🚀 Guide de Démarrage Rapide - Développeurs

## 📋 Prérequis

Assurez-vous d'avoir installé :
- Node.js >= 20.16.0
- npm >= 10.8.1
- Git
- VS Code (recommandé)

## 🛠️ Installation en 5 minutes

```bash
# 1. Cloner le projet
git clone https://github.com/votre-username/annigato.git
cd annigato

# 2. Installer les dépendances
npm install

# 3. Copier l'environnement
cp .env.example .env

# 4. Lancer le dev server
npm run dev
```

✨ C'est parti ! L'app est sur http://localhost:3000

## 🔍 Commandes Essentielles

```bash
npm run dev          # Lancer en développement
npm run build        # Build de production
npm run preview      # Preview du build
npm run lint         # Vérifier le code
npm test            # Lancer les tests (à venir)
```

## 📁 Où Trouver Quoi ?

```
src/
├── pages/          # 👉 Pages de l'app (HomePage, etc.)
├── components/     # 👉 Composants réutilisables
├── features/       # 👉 Logique métier (Redux)
├── store/          # 👉 Configuration Redux
└── styles/         # 👉 Styles globaux
```

## 🎨 Créer un Nouveau Composant

```bash
# Structure recommandée
src/components/MonComposant/
├── MonComposant.tsx      # Composant
├── MonComposant.test.tsx # Tests
├── MonComposant.module.css # Styles (optionnel)
└── index.ts              # Export
```

```typescript
// MonComposant.tsx
import { FC } from 'react'

interface MonComposantProps {
  title: string
}

export const MonComposant: FC<MonComposantProps> = ({ title }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  )
}

// index.ts
export { MonComposant } from './MonComposant'
```

## 🔄 Workflow Git

```bash
# 1. Créer une branche
git checkout -b feature/ma-feature

# 2. Coder et commiter
git add .
git commit -m "feat: ajouter ma super feature"

# 3. Pousser
git push origin feature/ma-feature

# 4. Créer une PR vers 'develop'
```

## 🎯 Checklist Avant PR

- [ ] Code compile (`npm run build`)
- [ ] Pas d'erreurs TypeScript
- [ ] Responsive mobile testé
- [ ] Commits conventionnels
- [ ] Documentation à jour

## 🆘 Besoin d'Aide ?

### Documentation
- [README Principal](./README.md)
- [Guide de Contribution](./CONTRIBUTING.md)
- [Roadmap](./README.md#-roadmap)

### Problèmes Courants

**Port 3000 déjà utilisé ?**
```bash
# Le serveur utilise automatiquement 3001, 3002, etc.
# Ou tuez le process :
npx kill-port 3000
```

**Erreurs TypeScript ?**
```bash
# Vérifier les types
npm run lint

# Redémarrer VS Code
Ctrl+Shift+P > "Reload Window"
```

**TailwindCSS ne fonctionne pas ?**
```bash
# Redémarrer le serveur dev
Ctrl+C
npm run dev
```

## 💡 Tips de Productivité

### Extensions VS Code Recommandées
- ES7+ React/Redux snippets
- Tailwind CSS IntelliSense
- Prettier
- ESLint
- GitLens

### Snippets Utiles
```typescript
// rfc - React Functional Component
// useState - Hook state
// useEffect - Hook effect
```

### Alias d'Import
```typescript
// Au lieu de :
import { Button } from '../../../components/Button'

// Utilisez :
import { Button } from '@/components/Button'
```

## 🎉 Prêt à Coder !

1. Choisissez une issue avec le label `good-first-issue`
2. Assignez-vous l'issue
3. Codez avec passion 🚀
4. Créez une PR épique

**Bienvenue dans l'équipe Annigato !** 🎂✨

---

Questions ? 👉 [GitHub Discussions](https://github.com/votre-username/annigato/discussions)
