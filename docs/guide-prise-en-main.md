# Annigato - Guide de prise en main

## Demarrage rapide

### Prerequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
git clone https://github.com/mouhalo/annigato.git
cd annigato
npm install
npm run dev
```
L'application demarre sur **http://localhost:3000**

---

## Configuration admin (obligatoire)

Avant d'utiliser la generation d'images IA, il faut configurer le provider.

### Acces au panneau admin

| Info | Valeur |
|------|--------|
| URL | http://localhost:3000/admin/settings |
| Mot de passe | `annigato2024` |

### Configurer la generation d'images

1. Aller sur **http://localhost:3000/admin/settings**
2. Entrer le mot de passe `annigato2024`
3. Dans la section **Generation d'images**, selectionner **Pollinations.ai**
4. Coller la cle API dans le champ prevu : `sk_afxEDp74d0DteHY2LuUV7cbwGxXMckzG`
5. Modele recommande : **FLUX** (selectionne par defaut)

Les parametres sont sauvegardes automatiquement dans le localStorage du navigateur.

### Providers d'images disponibles

| Provider | Cle API | Modeles | Usage |
|----------|---------|---------|-------|
| **Pollinations.ai** | `sk_afxEDp...` | FLUX, FLUX Pro, GPT Image, Seedream, Imagen 4 | Production |
| **HuggingFace** | `hf_xxxxx` | FLUX.1-schnell, FLUX.1-dev, Stable Diffusion XL, SD v1.5 | Alternative |
| **Placeholder** | Aucune | SVG thematique local | Demo / hors-ligne |

### Configurer l'assistant IA (chat)

Dans la section **Assistant IA (Chat)** du panneau admin :

| Parametre | Valeur par defaut | Description |
|-----------|-------------------|-------------|
| Fournisseur | Claude (Anthropic) | Claude, OpenAI ou Ollama |
| Cle API | _(vide = mode demo)_ | Sans cle, l'assistant utilise des reponses mock intelligentes |
| Modele | _(auto)_ | Ex: claude-sonnet-4-20250514, gpt-4o-mini |

Le mode demo (sans cle API) fonctionne parfaitement pour les tests.

---

## Pages de l'application

| Route | Description | Acces |
|-------|-------------|-------|
| `/` | Page d'accueil avec catalogue de gateaux | Public |
| `/creer` | Module de creation de gateau (2 modes) | Public |
| `/admin/settings` | Panneau de configuration admin | Protege par mot de passe |
| `/espace-parent` | Espace parent (a venir) | Public |

---

## Module de creation (`/creer`)

### Deux modes disponibles

**Petit Chef** (6-9 ans) - 4 etapes simplifiees :
- Theme (licorne, super-heros, princesse...)
- Saveur
- Message sur le gateau
- Apercu + generation IA

**Grand Patissier** (10-13 ans) - 6 etapes completes :
- Forme et taille
- Saveur
- Decorations
- Couleurs (max 3)
- Message
- Apercu + generation IA

### Assistant IA "Chef Patou"

Le bouton violet flottant en bas a droite ouvre l'assistant chat.
- **Texte** : l'enfant tape son message
- **Dictee vocale** : bouton micro pour dicter en francais (navigateurs compatibles)
- L'assistant guide l'enfant et peut remplir automatiquement les choix du gateau

---

## Stack technique

| Technologie | Version | Role |
|-------------|---------|------|
| React | 18 | Framework UI |
| TypeScript | 5.8 | Typage |
| Vite | 7 | Bundler |
| TailwindCSS | v4 | Styles |
| Redux Toolkit | - | State management |
| react-router-dom | v6 | Routing |
| lucide-react | - | Icones |

### Structure du projet
```
src/
  pages/              # Pages principales
  features/           # Modules Redux (auth, cart, cakes, creation, settings)
  services/           # Services (imageGeneration, llmService)
  types/              # Types TypeScript partages
  data/               # Donnees statiques (catalogue, options creation)
  store/              # Configuration Redux store
```

---

## Cles API de l'equipe

> Ces cles sont a configurer dans le panneau admin, pas dans le code source.

| Service | Cle | Statut |
|---------|-----|--------|
| Pollinations.ai | `sk_afxEDp74d0DteHY2LuUV7cbwGxXMckzG` | Active |
| HuggingFace | _(a obtenir sur huggingface.co)_ | Non configuree |
| LLM (Claude/OpenAI) | _(optionnel)_ | Mode demo par defaut |

---

## Commandes utiles

```bash
npm run dev       # Serveur de dev (port 3000)
npm run build     # Build production (dans build/)
npm run preview   # Preview du build
```
