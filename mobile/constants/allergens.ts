/**
 * SafeScan — Allergen Definitions
 * 
 * Major allergen groups with display names, icons, and search keywords.
 * Covers internationally recognized allergens + Africa-specific considerations.
 */

export interface AllergenDefinition {
  key: string;
  label: string;
  icon: string;
  keywords: string[];   // Terms that trigger this allergen flag
  description: string;
}

export const ALLERGENS: AllergenDefinition[] = [
  {
    key: 'milk',
    label: 'Milk / Dairy',
    icon: '🥛',
    keywords: ['milk', 'dairy', 'lactose', 'casein', 'whey', 'cream', 'butter', 'ghee', 'cheese', 'yogurt', 'lactalbumin', 'lactoferrin'],
    description: 'Contains milk or milk-derived ingredients.',
  },
  {
    key: 'eggs',
    label: 'Eggs',
    icon: '🥚',
    keywords: ['egg', 'albumin', 'globulin', 'lysozyme', 'mayonnaise', 'meringue', 'ovalbumin', 'ovomucin'],
    description: 'Contains egg or egg-derived ingredients.',
  },
  {
    key: 'peanuts',
    label: 'Peanuts',
    icon: '🥜',
    keywords: ['peanut', 'groundnut', 'arachis', 'arachis hypogaea', 'monkey nut'],
    description: 'Contains peanuts or peanut-derived ingredients.',
  },
  {
    key: 'tree_nuts',
    label: 'Tree Nuts',
    icon: '🌰',
    keywords: ['almond', 'cashew', 'walnut', 'pistachio', 'pecan', 'macadamia', 'brazil nut', 'hazelnut', 'chestnut', 'pine nut', 'praline', 'marzipan', 'nougat'],
    description: 'Contains tree nuts or tree nut-derived ingredients.',
  },
  {
    key: 'wheat_gluten',
    label: 'Wheat / Gluten',
    icon: '🌾',
    keywords: ['wheat', 'gluten', 'flour', 'semolina', 'spelt', 'kamut', 'durum', 'einkorn', 'farro', 'triticale', 'couscous', 'bulgur', 'seitan'],
    description: 'Contains wheat, gluten, or gluten-containing cereals.',
  },
  {
    key: 'soy',
    label: 'Soy',
    icon: '🫘',
    keywords: ['soy', 'soya', 'soybean', 'edamame', 'tofu', 'tempeh', 'miso', 'soy lecithin', 'soy protein'],
    description: 'Contains soy or soy-derived ingredients.',
  },
  {
    key: 'fish',
    label: 'Fish',
    icon: '🐟',
    keywords: ['fish', 'cod', 'salmon', 'tuna', 'anchovy', 'sardine', 'tilapia', 'mackerel', 'haddock', 'pollock', 'catfish', 'fish sauce', 'fish oil', 'omega-3'],
    description: 'Contains fish or fish-derived ingredients.',
  },
  {
    key: 'shellfish',
    label: 'Shellfish',
    icon: '🦐',
    keywords: ['shellfish', 'shrimp', 'prawn', 'crab', 'lobster', 'crayfish', 'crevette', 'scallop', 'clam', 'mussel', 'oyster', 'squid', 'calamari'],
    description: 'Contains shellfish or crustacean ingredients.',
  },
  {
    key: 'sesame',
    label: 'Sesame',
    icon: '🫘',
    keywords: ['sesame', 'tahini', 'halvah', 'hummus', 'sesame oil', 'sesame seed', 'benne'],
    description: 'Contains sesame or sesame-derived ingredients.',
  },
  {
    key: 'celery',
    label: 'Celery',
    icon: '🥬',
    keywords: ['celery', 'celeriac', 'celery salt', 'celery seed'],
    description: 'Contains celery or celery-derived ingredients.',
  },
  {
    key: 'mustard',
    label: 'Mustard',
    icon: '🟡',
    keywords: ['mustard', 'mustard seed', 'mustard oil', 'mustard flour'],
    description: 'Contains mustard or mustard-derived ingredients.',
  },
  {
    key: 'lupin',
    label: 'Lupin',
    icon: '🌿',
    keywords: ['lupin', 'lupine', 'lupini'],
    description: 'Contains lupin or lupin-derived ingredients.',
  },
  {
    key: 'molluscs',
    label: 'Molluscs',
    icon: '🐚',
    keywords: ['mollusc', 'mollusk', 'snail', 'escargot', 'octopus', 'abalone'],
    description: 'Contains molluscs or mollusc-derived ingredients.',
  },
  {
    key: 'sulfites',
    label: 'Sulfites',
    icon: '⚗️',
    keywords: ['sulfite', 'sulphite', 'sulfur dioxide', 'sulphur dioxide', 'sodium metabisulfite', 'sodium bisulfite', 'potassium metabisulfite', 'E220', 'E221', 'E222', 'E223', 'E224', 'E225', 'E226', 'E227', 'E228'],
    description: 'Contains sulfites or sulfite-based preservatives.',
  },
];

/**
 * Lookup an allergen by key
 */
export function getAllergen(key: string): AllergenDefinition | undefined {
  return ALLERGENS.find(a => a.key === key);
}

/**
 * Get all allergen keys as a flat array — for profile selection
 */
export function getAllergenKeys(): string[] {
  return ALLERGENS.map(a => a.key);
}
