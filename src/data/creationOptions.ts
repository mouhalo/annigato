import type {
  CakeTheme,
  CakeFlavor,
  CakeBase,
  CakeSize,
  CakeDecoration,
  PetitChefStep,
  GrandPatissierStep
} from '../types/creation'

// === Themes pour le mode Petit Chef ===
export const cakeThemes: CakeTheme[] = [
  { id: 'unicorn', label: 'Licorne', icon: '\u{1F984}', color: '#FFB6C1', suggestedFlavor: 'vanilla', suggestedDecorations: ['rainbow-sprinkles', 'stars'] },
  { id: 'superhero', label: 'Super-Heros', icon: '\u{1F9B8}', color: '#4169E1', suggestedFlavor: 'chocolate', suggestedDecorations: ['stars', 'lightning'] },
  { id: 'princess', label: 'Princesse', icon: '\u{1F451}', color: '#DDA0DD', suggestedFlavor: 'strawberry', suggestedDecorations: ['crown', 'flowers'] },
  { id: 'pirate', label: 'Pirate', icon: '\u{1F3F4}\u{200D}\u{2620}\u{FE0F}', color: '#8B4513', suggestedFlavor: 'caramel', suggestedDecorations: ['flag', 'treasure'] },
  { id: 'space', label: 'Espace', icon: '\u{1F680}', color: '#191970', suggestedFlavor: 'blueberry', suggestedDecorations: ['stars', 'rocket'] },
  { id: 'jungle', label: 'Jungle', icon: '\u{1F33F}', color: '#228B22', suggestedFlavor: 'banana', suggestedDecorations: ['leaves', 'animals'] },
  { id: 'ocean', label: 'Ocean', icon: '\u{1F30A}', color: '#00CED1', suggestedFlavor: 'coconut', suggestedDecorations: ['shells', 'fish'] },
  { id: 'rainbow', label: 'Arc-en-ciel', icon: '\u{1F308}', color: '#FF6B6B', suggestedFlavor: 'vanilla', suggestedDecorations: ['rainbow-sprinkles', 'clouds'] },
]

// === Bases pour le mode Grand Patissier ===
export const cakeBases: CakeBase[] = [
  { id: 'round', label: 'Rond', icon: '\u{2B55}', shapes: [
    { id: 'round-classic', label: 'Classique', icon: '\u{1F382}' },
    { id: 'round-tall', label: 'Haut (2 etages)', icon: '\u{1F3E0}' },
  ]},
  { id: 'square', label: 'Carre', icon: '\u{1F7E8}', shapes: [
    { id: 'square-classic', label: 'Classique', icon: '\u{2B1C}' },
    { id: 'square-tiered', label: 'A etages', icon: '\u{1F4E6}' },
  ]},
  { id: 'heart', label: 'Coeur', icon: '\u{2764}\u{FE0F}', shapes: [
    { id: 'heart-simple', label: 'Simple', icon: '\u{1F496}' },
  ]},
  { id: 'star', label: 'Etoile', icon: '\u{2B50}', shapes: [
    { id: 'star-simple', label: 'Simple', icon: '\u{1F31F}' },
  ]},
]

// === Tailles ===
export const cakeSizes: CakeSize[] = [
  { id: 'small', label: 'Petit', portions: '6-8 parts', priceMultiplier: 1 },
  { id: 'medium', label: 'Moyen', portions: '10-14 parts', priceMultiplier: 1.5 },
  { id: 'large', label: 'Grand', portions: '16-20 parts', priceMultiplier: 2 },
  { id: 'xl', label: 'Geant', portions: '24-30 parts', priceMultiplier: 2.5 },
]

// === Saveurs ===
export const cakeFlavors: CakeFlavor[] = [
  { id: 'vanilla', label: 'Vanille', color: '#FFF8DC', icon: '\u{1F9C1}', category: 'classic' },
  { id: 'chocolate', label: 'Chocolat', color: '#8B4513', icon: '\u{1F36B}', category: 'classic' },
  { id: 'strawberry', label: 'Fraise', color: '#FF6B6B', icon: '\u{1F353}', category: 'fruit' },
  { id: 'caramel', label: 'Caramel', color: '#D2691E', icon: '\u{1F36E}', category: 'classic' },
  { id: 'lemon', label: 'Citron', color: '#FFF44F', icon: '\u{1F34B}', category: 'fruit' },
  { id: 'coconut', label: 'Noix de coco', color: '#FFFAF0', icon: '\u{1F965}', category: 'fruit' },
  { id: 'blueberry', label: 'Myrtille', color: '#4169E1', icon: '\u{1FAD0}', category: 'fruit' },
  { id: 'banana', label: 'Banane', color: '#FFE135', icon: '\u{1F34C}', category: 'fruit' },
  { id: 'redvelvet', label: 'Red Velvet', color: '#DC143C', icon: '\u{2764}\u{FE0F}', category: 'special' },
  { id: 'pistachio', label: 'Pistache', color: '#93C572', icon: '\u{1F33F}', category: 'special' },
]

// === Decorations ===
export const cakeDecorations: CakeDecoration[] = [
  { id: 'rainbow-sprinkles', label: 'Vermicelles colores', icon: '\u{1F308}', category: 'sprinkle' },
  { id: 'chocolate-chips', label: 'Pepites chocolat', icon: '\u{1F36B}', category: 'sprinkle' },
  { id: 'stars', label: 'Etoiles en sucre', icon: '\u{2B50}', category: 'topping' },
  { id: 'flowers', label: 'Fleurs en sucre', icon: '\u{1F33A}', category: 'topping' },
  { id: 'crown', label: 'Couronne', icon: '\u{1F451}', category: 'figurine' },
  { id: 'animals', label: 'Animaux', icon: '\u{1F43B}', category: 'figurine' },
  { id: 'flag', label: 'Drapeau pirate', icon: '\u{1F3F4}\u{200D}\u{2620}\u{FE0F}', category: 'figurine' },
  { id: 'rocket', label: 'Fusee', icon: '\u{1F680}', category: 'figurine' },
  { id: 'candles-number', label: 'Bougies chiffre', icon: '\u{1F56F}\u{FE0F}', category: 'candle' },
  { id: 'candles-sparkle', label: 'Bougies etincelles', icon: '\u{2728}', category: 'candle' },
  { id: 'fruits-fresh', label: 'Fruits frais', icon: '\u{1F353}', category: 'topping' },
  { id: 'whipped-cream', label: 'Chantilly', icon: '\u{1F366}', category: 'topping' },
]

// === Couleurs disponibles ===
export const cakeColors = [
  { id: 'pink', label: 'Rose', hex: '#FFB6C1' },
  { id: 'blue', label: 'Bleu', hex: '#87CEEB' },
  { id: 'purple', label: 'Violet', hex: '#DDA0DD' },
  { id: 'green', label: 'Vert', hex: '#90EE90' },
  { id: 'yellow', label: 'Jaune', hex: '#FFC947' },
  { id: 'orange', label: 'Orange', hex: '#FF8E53' },
  { id: 'red', label: 'Rouge', hex: '#FF6B6B' },
  { id: 'white', label: 'Blanc', hex: '#FFFFFF' },
  { id: 'brown', label: 'Marron', hex: '#8B4513' },
  { id: 'turquoise', label: 'Turquoise', hex: '#00CED1' },
]

// === Ordre des etapes par mode ===
export const petitChefSteps: PetitChefStep[] = ['theme', 'flavor', 'message', 'preview']
export const grandPatissierSteps: GrandPatissierStep[] = ['base', 'flavor', 'decoration', 'colors', 'message', 'preview']

// === Labels des etapes ===
export const stepLabels: Record<string, { label: string; icon: string }> = {
  theme: { label: 'Theme', icon: '\u{1F3A8}' },
  base: { label: 'Forme', icon: '\u{1F382}' },
  flavor: { label: 'Saveur', icon: '\u{1F36D}' },
  decoration: { label: 'Deco', icon: '\u{2728}' },
  colors: { label: 'Couleurs', icon: '\u{1F308}' },
  message: { label: 'Message', icon: '\u{1F4DD}' },
  preview: { label: 'Apercu', icon: '\u{1F440}' },
}
