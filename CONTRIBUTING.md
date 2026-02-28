# 🤝 Guide de Contribution - Annigato

Merci de votre intérêt pour contribuer à Annigato ! Ce guide vous aidera à comprendre notre processus de développement et nos standards.

## 📋 Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Workflow de Développement](#workflow-de-développement)
- [Standards de Code](#standards-de-code)
- [Tests](#tests)
- [Documentation](#documentation)

## Code de Conduite

Ce projet adhère à un code de conduite bienveillant. En participant, vous vous engagez à maintenir un environnement accueillant et respectueux.

## Comment Contribuer

### 🐛 Reporter des Bugs

1. Vérifiez que le bug n'a pas déjà été reporté dans les [Issues](https://github.com/votre-username/annigato/issues)
2. Créez une nouvelle issue avec le template "Bug Report"
3. Incluez :
   - Description claire du problème
   - Étapes pour reproduire
   - Comportement attendu vs observé
   - Screenshots si applicable
   - Environnement (OS, navigateur, version Node.js)

### 💡 Proposer des Fonctionnalités

1. Vérifiez la [Roadmap](README.md#-roadmap) et les issues existantes
2. Créez une issue avec le template "Feature Request"
3. Décrivez :
   - Le problème que cela résout
   - La solution proposée
   - Les alternatives considérées

### 🔧 Soumettre des Changements

1. Fork le repository
2. Créez votre branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (voir [Conventions de Commit](#conventions-de-commit))
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## Workflow de Développement

### Branches

```
main         # Production (protégée)
├── develop  # Développement principal
    ├── feature/*     # Nouvelles fonctionnalités
    ├── fix/*        # Corrections de bugs
    ├── docs/*       # Documentation
    └── refactor/*   # Refactoring
```

### Conventions de Commit

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
# Format
<type>(<scope>): <subject>

# Exemples
feat(auth): ajouter connexion avec Google
fix(cart): corriger calcul du total
docs(readme): mettre à jour installation
style(home): améliorer responsive mobile
refactor(store): simplifier les reducers
test(auth): ajouter tests pour login
chore(deps): mettre à jour React à 18.3
```

**Types autorisés :**
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, CSS
- `refactor`: Refactoring sans changement fonctionnel
- `test`: Ajout ou modification de tests
- `chore`: Maintenance, dépendances

## Standards de Code

### TypeScript

```typescript
// ✅ BON - Types explicites
interface CakeProps {
  id: string
  name: string
  price: number
}

// ❌ MAUVAIS - Éviter any
const processCake = (cake: any) => { }

// ✅ BON - Enums pour les constantes
enum CakeSize {
  Small = 'SMALL',
  Medium = 'MEDIUM',
  Large = 'LARGE'
}

// ✅ BON - Types utilitaires
type PartialCake = Partial<CakeProps>
type RequiredCake = Required<CakeProps>
```

### React

```typescript
// ✅ BON - Composant fonctionnel typé
import { FC, useState, useEffect } from 'react'

interface ButtonProps {
  variant: 'primary' | 'secondary'
  onClick: () => void
  children: React.ReactNode
}

export const Button: FC<ButtonProps> = ({ variant, onClick, children }) => {
  // Hooks en haut
  const [isLoading, setIsLoading] = useState(false)
  
  // Effects après les hooks
  useEffect(() => {
    // Cleanup si nécessaire
    return () => { }
  }, [])
  
  // Handlers avant le return
  const handleClick = () => {
    setIsLoading(true)
    onClick()
  }
  
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {children}
    </button>
  )
}
```

### CSS/TailwindCSS

```tsx
// ✅ BON - Classes organisées et lisibles
<div className="
  flex items-center justify-between
  p-4 sm:p-6 md:p-8
  bg-white hover:bg-gray-50
  rounded-lg shadow-md
  transition-colors duration-200
">

// ❌ MAUVAIS - Tout sur une ligne
<div className="flex items-center justify-between p-4 sm:p-6 md:p-8 bg-white hover:bg-gray-50 rounded-lg shadow-md transition-colors duration-200">

// ✅ BON - Extraction pour réutilisation
const cardStyles = "bg-white rounded-lg shadow-md p-4"
```

### Structure des Fichiers

```typescript
// components/Button/Button.tsx
export const Button: FC<ButtonProps> = () => { }

// components/Button/Button.test.tsx
describe('Button', () => { })

// components/Button/Button.module.css
.button { }

// components/Button/index.ts
export { Button } from './Button'
export type { ButtonProps } from './Button'
```

## Tests

### Tests Unitaires

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('should call onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Tests E2E (Cypress)

```typescript
// cypress/e2e/home.cy.ts
describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  
  it('should display cake carousel', () => {
    cy.get('[data-testid="cake-carousel"]').should('be.visible')
    cy.get('[data-testid="cake-card"]').should('have.length.at.least', 1)
  })
  
  it('should filter cakes by category', () => {
    cy.get('[data-testid="category-chocolate"]').click()
    cy.get('[data-testid="cake-card"]').each(($el) => {
      cy.wrap($el).should('contain', 'Choco')
    })
  })
})
```

### Coverage Minimum

- Statements : 80%
- Branches : 75%
- Functions : 80%
- Lines : 80%

## Documentation

### JSDoc pour les Fonctions Complexes

```typescript
/**
 * Calcule le prix total d'un gâteau avec options
 * @param basePrice - Prix de base du gâteau
 * @param options - Options sélectionnées
 * @returns Prix total en euros
 * @example
 * calculatePrice(20, { size: 'large', decorations: ['candles'] })
 * // returns 28.50
 */
export const calculatePrice = (
  basePrice: number,
  options: CakeOptions
): number => {
  // Implementation
}
```

### README des Composants

Chaque composant complexe doit avoir un README :

```markdown
# Button Component

## Usage
\```tsx
import { Button } from '@/components/Button'

<Button variant="primary" onClick={handleClick}>
  Click me
</Button>
\```

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' | 'primary' | Style du bouton |
| size | 'small' \| 'medium' \| 'large' | 'medium' | Taille du bouton |
```

## Review Process

### Checklist PR

Avant de soumettre votre PR, assurez-vous que :

- [ ] Le code compile sans erreurs (`npm run build`)
- [ ] Les tests passent (`npm test`)
- [ ] Le linting passe (`npm run lint`)
- [ ] La documentation est à jour
- [ ] Les commits suivent les conventions
- [ ] La PR a une description claire
- [ ] Les screenshots sont inclus (si UI)

### Review Automatique

Les PRs déclenchent automatiquement :
- Build de vérification
- Tests unitaires et E2E
- Analyse de code (ESLint, TypeScript)
- Vérification de la couverture

## Questions ?

- 💬 [Discussions GitHub](https://github.com/votre-username/annigato/discussions)
- 📧 dev@annigato.com
- 📚 [Documentation technique](./docs/technical)

---

Merci de contribuer à rendre Annigato meilleur ! 🎂✨
