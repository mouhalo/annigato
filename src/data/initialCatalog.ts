import type { Cake, Category } from '../types/cake'

export const initialCakes: Cake[] = [
  {
    id: '1',
    name: 'Licorne Arc-en-ciel',
    description: 'Un gateau magique aux couleurs de l\'arc-en-ciel',
    category: 'magic',
    basePrice: 35,
    imageUrl: '',
    color: '#FFB6C1',
    likes: 0,
    stars: 5,
    available: true
  },
  {
    id: '2',
    name: 'Choco Explosion',
    description: 'Triple chocolat pour les vrais gourmands',
    category: 'chocolate',
    basePrice: 30,
    imageUrl: '',
    color: '#8B4513',
    likes: 0,
    stars: 4,
    available: true
  },
  {
    id: '3',
    name: 'Jardin des Fruits',
    description: 'Fruits frais de saison sur genoise legere',
    category: 'fruits',
    basePrice: 32,
    imageUrl: '',
    color: '#90EE90',
    likes: 0,
    stars: 5,
    available: true
  },
  {
    id: '4',
    name: 'Chateau de Princesse',
    description: 'Un chateau ferique en gateau',
    category: 'magic',
    basePrice: 45,
    imageUrl: '',
    color: '#DDA0DD',
    likes: 0,
    stars: 5,
    available: true
  },
  {
    id: '5',
    name: 'Super Heros',
    description: 'Le gateau des super-heros en herbe',
    category: 'special',
    basePrice: 40,
    imageUrl: '',
    color: '#4169E1',
    likes: 0,
    stars: 4,
    available: true
  },
  {
    id: '6',
    name: 'Ocean Tropical',
    description: 'Saveurs exotiques et decoration marine',
    category: 'fruits',
    basePrice: 38,
    imageUrl: '',
    color: '#00CED1',
    likes: 0,
    stars: 5,
    available: true
  }
]

export const categories: Category[] = [
  { id: 'all', label: 'Tous', icon: '\u{1F382}' },
  { id: 'chocolate', label: 'Chocolat', icon: '\u{1F36B}' },
  { id: 'fruits', label: 'Fruits', icon: '\u{1F353}' },
  { id: 'magic', label: 'Magique', icon: '\u{1F984}' },
  { id: 'special', label: 'Special', icon: '\u{2B50}' }
]
