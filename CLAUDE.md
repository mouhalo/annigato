# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Annigato is a web app for children (6-13 years old) to design, customize and order birthday cakes with AI image generation. The UI is playful, colorful, and child-friendly.

## Commands

```bash
npm run dev          # Dev server on http://localhost:3000
npm run build        # TypeScript check + Vite production build (output: build/)
npm run lint         # TypeScript type-check only (tsc --noEmit)
npm run preview      # Preview production build locally
```

No test runner is currently configured (jest deps exist but no working test script).

## Architecture

### Stack

React 18 + TypeScript 5.8 + Vite 7 + TailwindCSS v4 + Redux Toolkit. Path alias `@/` maps to `./src/`.

### Routing (react-router-dom v6)

Routes defined in `src/App.tsx`:
- `/` → `AnnigatoHomePage` — catalog with carousel, filters, likes
- `/creer` → `CreateCakePage` — multi-step cake creation wizard
- `/admin/settings` → `AdminSettingsPage` — provider config (password-protected)
- `/espace-parent` → `EspaceParentPage` — placeholder

### Redux Store (5 slices)

Configured in `src/store/store.ts`. Use typed hooks from `src/store/hooks.ts` (`useAppSelector`, `useAppDispatch`), not raw `useSelector`/`useDispatch`.

| Slice | File | Purpose |
|-------|------|---------|
| `auth` | `features/auth/authSlice.ts` | Parent/child authentication |
| `cart` | `features/cart/cartSlice.ts` | Shopping cart |
| `cakes` | `features/cakes/cakesSlice.ts` | Cake catalog, user creations |
| `creation` | `features/creation/creationSlice.ts` | Multi-step cake creation wizard state |
| `settings` | `features/settings/settingsSlice.ts` | Admin settings, API keys (persisted to localStorage) |

### Cake Creation Module

Two creation modes with different step sequences:
- **Petit Chef** (ages 6-9): theme → flavor → message → preview
- **Grand Patissier** (ages 10-13): base → flavor → decoration → colors → message → preview

Step components live in `src/features/creation/components/`. Options data (themes, flavors, decorations, colors, sizes) in `src/data/creationOptions.ts`.

#### Multi-Generation Preview (3 slots)

The preview step (`PreviewStep.tsx`) offers 3 generation slots. The user generates 3 cake image variants one at a time, then selects their favorite.

**Redux state** (in `creationSlice`):
- `generatedImages: (string | null)[]` — array of 3 blob URLs (`[null, null, null]` initially)
- `generatingSlot: number | null` — index of slot currently generating
- `generationErrors: (string | null)[]` — per-slot errors
- `selectedImageIndex: number | null` — user's chosen image

**Key actions**: `setGeneratedImage({index, url})`, `setGenerating(slotIndex)`, `setGenerationError({index, error})`, `selectImage(index)`

**UI rules**:
- Only one slot generates at a time (other "Générer" buttons disabled)
- "Choix X" buttons stay disabled until all 3 images are generated
- Selection is visual-only (amber border + check badge), user can change mind
- "Terminer" button appears only when `selectedImageIndex !== null`
- Component: `ImageSlot` handles 5 states (empty, generating, generated, selected, error)

### Services

- `src/services/imageGeneration.ts` — Multi-provider image generation (HuggingFace, Pollinations, placeholder SVG). Includes `buildCakePrompt()` for constructing prompts from user choices.
- `src/services/llmService.ts` — Chat assistant for guided cake creation. Supports Claude, OpenAI, and mock mode. Extracts structured choices from LLM responses via `extractChoicesFromResponse()`.

### Settings & Providers

Settings slice persists to `localStorage` under key `annigato_settings`. Admin auth uses a simple password check (default: `annigato2024`). Provider configs (API keys, models, base URLs) are managed through the admin settings page.

Image providers: `huggingface` (FLUX.1-schnell), `pollinations` (flux), `placeholder` (offline SVG).
LLM providers: `claude`, `openai`, `ollama`.

## Conventions

- TailwindCSS v4 with `@import "tailwindcss"` in `src/index.css`. PostCSS config uses `@tailwindcss/postcss`.
- Components use `React.FC<Props>` pattern with PascalCase naming.
- Conventional commits: `feat:`, `fix:`, `docs:`, etc.
- Icons from `lucide-react`.
- TypeScript strict mode enabled (`noUnusedLocals`, `noUnusedParameters`).
- CSS custom animations defined in `src/index.css` (float, pulse-glow, flicker, confetti, slideUp).
