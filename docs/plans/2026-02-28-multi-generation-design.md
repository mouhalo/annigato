# Design: Multi-Generation Preview (3 slots)

## Objectif

Remplacer la generation unique par 3 slots de generation dans le PreviewStep. L'utilisateur genere 3 variantes de son gateau, puis choisit sa preferee.

## Approche retenue

**Approche A : State dans le slice Redux** - Etendre `creationSlice` avec un tableau de 3 images et un index de selection.

## Modifications du State Redux (creationSlice)

### Champs modifies dans CreationState

| Ancien champ | Nouveau champ | Type | Description |
|---|---|---|---|
| `generatedImageUrl: string \| null` | `generatedImages: (string \| null)[]` | `[null, null, null]` | Tableau de 3 slots d'images |
| `isGenerating: boolean` | `generatingSlot: number \| null` | `number \| null` | Index du slot en cours de generation (null = aucun) |
| `generationError: string \| null` | `generationErrors: (string \| null)[]` | `[null, null, null]` | Erreur par slot |
| _(nouveau)_ | `selectedImageIndex: number \| null` | `number \| null` | Index de l'image choisie |

### Actions modifiees/ajoutees

- `setGeneratedImage(payload: {index, url})` - image generee pour un slot
- `setGenerating(payload: number \| null)` - index du slot en generation
- `setGenerationError(payload: {index, error})` - erreur par slot
- `selectImage(payload: number)` - selectionner un choix
- `resetCreation` adapte pour reinitialiser les tableaux

### Selecteurs adaptes

- `selectIsImageGenerating` -> verifie `generatingSlot !== null`
- `selectGeneratedImageUrl` -> remplace par `selectGeneratedImages` (tableau) + `selectSelectedImage` (image choisie)

## UI du composant PreviewStep

### Layout des 3 slots

3 containers cote a cote (desktop/tablette) ou empiles (mobile) sous le resume des choix.

### Etats visuels de chaque slot

| Etat | Container | Bouton | Interaction |
|---|---|---|---|
| **Vide** | Bordure pointillee, fond gris clair, icone placeholder | "Generer X" (gradient orange/rose actif) | Cliquable |
| **En cours** | Spinner anime + "Creation en cours..." | "Generer X" grise + loader | Desactive |
| **Genere** | Image affichee avec ombre | "Choix X" (style outline) | Cliquable seulement quand les 3 sont generees |
| **Selectionne** | Image + bordure doree epaisse + check vert | "Choix X" en surbrillance (fond dore) | Actif |
| **Erreur** | Message d'erreur rouge dans le slot | "Reessayer" (remplace "Generer X") | Cliquable pour regenerer ce slot |

### Regles de comportement

- Boutons "Choix X" desactives tant que les 3 images ne sont pas generees
- Un seul slot en generation a la fois (autres "Generer" grises pendant)
- Bouton "Terminer" visible uniquement quand une image est selectionnee
- Erreur sur un slot: "Reessayer" permet de regenerer ce slot uniquement
- Responsive: empilage vertical sur mobile, cote a cote sur desktop

## Flux de donnees

1. Arrivee apercu -> 3 slots vides avec "Generer 1/2/3"
2. Clic "Generer 1" -> dispatch setGenerating(0) -> appel generateCakeImage() -> succes/erreur
3. Clic "Generer 2" -> meme flow avec index 1
4. Clic "Generer 3" -> meme flow avec index 2
5. 3 remplies -> boutons "Choix 1/2/3" actifs
6. Clic "Choix X" -> dispatch selectImage(X) -> highlight visuel
7. Changement d'avis possible -> clic autre "Choix"
8. Clic "Terminer" -> image selectionnee retenue

Chaque generation utilise le meme `buildCakePrompt()`. Les resultats different grace au seed aleatoire de Pollinations.

## Fichiers impactes

- `src/features/creation/creationSlice.ts` - state, actions, selecteurs
- `src/types/creation.ts` - type CreationState
- `src/features/creation/components/PreviewStep.tsx` - UI complete refaite
- Aucun changement sur `imageGeneration.ts`, `buildCakePrompt()`, ou les autres etapes
