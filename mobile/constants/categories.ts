/**
 * SafeScan — Product Category Definitions
 * 
 * Used for product classification and routing to the correct safety rule engine.
 */

export type ProductCategory =
  | 'food'
  | 'beverage'
  | 'skincare'
  | 'haircare'
  | 'makeup'
  | 'body_lotion'
  | 'soap'
  | 'fragrance'
  | 'oral_care'
  | 'baby_product'
  | 'supplement'
  | 'unknown';

export interface CategoryDefinition {
  key: ProductCategory;
  label: string;
  icon: string;
  ruleEngine: 'food' | 'cosmetic';       // Which safety rule set to apply
  isLeaveOn: boolean | null;              // Cosmetic: leave-on vs rinse-off (null = N/A for food)
  hasNutritionPanel: boolean;             // Whether to expect/parse nutrition facts
  description: string;
}

export const CATEGORIES: Record<ProductCategory, CategoryDefinition> = {
  food: {
    key: 'food',
    label: 'Food',
    icon: '🍽️',
    ruleEngine: 'food',
    isLeaveOn: null,
    hasNutritionPanel: true,
    description: 'Packaged food products including snacks, canned goods, cereals, and prepared foods.',
  },
  beverage: {
    key: 'beverage',
    label: 'Beverage',
    icon: '🥤',
    ruleEngine: 'food',
    isLeaveOn: null,
    hasNutritionPanel: true,
    description: 'Drinks including soft drinks, juices, water, dairy beverages, and energy drinks.',
  },
  skincare: {
    key: 'skincare',
    label: 'Skincare',
    icon: '🧴',
    ruleEngine: 'cosmetic',
    isLeaveOn: true,
    hasNutritionPanel: false,
    description: 'Face and body skincare products including moisturizers, serums, sunscreens, and toners.',
  },
  haircare: {
    key: 'haircare',
    label: 'Haircare',
    icon: '💇',
    ruleEngine: 'cosmetic',
    isLeaveOn: false,           // Most haircare is rinse-off (shampoo, conditioner)
    hasNutritionPanel: false,
    description: 'Shampoos, conditioners, hair treatments, and styling products.',
  },
  makeup: {
    key: 'makeup',
    label: 'Makeup',
    icon: '💄',
    ruleEngine: 'cosmetic',
    isLeaveOn: true,
    hasNutritionPanel: false,
    description: 'Color cosmetics including foundation, lipstick, mascara, and eyeshadow.',
  },
  body_lotion: {
    key: 'body_lotion',
    label: 'Body Lotion',
    icon: '🧴',
    ruleEngine: 'cosmetic',
    isLeaveOn: true,
    hasNutritionPanel: false,
    description: 'Body moisturizers, lotions, and body butters.',
  },
  soap: {
    key: 'soap',
    label: 'Soap / Cleanser',
    icon: '🧼',
    ruleEngine: 'cosmetic',
    isLeaveOn: false,
    hasNutritionPanel: false,
    description: 'Bar soaps, liquid soaps, body washes, and facial cleansers.',
  },
  fragrance: {
    key: 'fragrance',
    label: 'Fragrance',
    icon: '🌸',
    ruleEngine: 'cosmetic',
    isLeaveOn: true,
    hasNutritionPanel: false,
    description: 'Perfumes, eau de toilette, body sprays, and scented products.',
  },
  oral_care: {
    key: 'oral_care',
    label: 'Oral Care',
    icon: '🦷',
    ruleEngine: 'cosmetic',
    isLeaveOn: false,
    hasNutritionPanel: false,
    description: 'Toothpaste, mouthwash, and oral hygiene products.',
  },
  baby_product: {
    key: 'baby_product',
    label: 'Baby Product',
    icon: '👶',
    ruleEngine: 'cosmetic',
    isLeaveOn: true,
    hasNutritionPanel: false,
    description: 'Baby lotions, creams, oils, and baby-specific skincare.',
  },
  supplement: {
    key: 'supplement',
    label: 'Supplement',
    icon: '💊',
    ruleEngine: 'food',
    isLeaveOn: null,
    hasNutritionPanel: true,
    description: 'Dietary supplements, vitamins, and nutritional products.',
  },
  unknown: {
    key: 'unknown',
    label: 'Unknown',
    icon: '❓',
    ruleEngine: 'food',
    isLeaveOn: null,
    hasNutritionPanel: false,
    description: 'Product category could not be determined.',
  },
} as const;

/**
 * Get a category definition by key.
 */
export function getCategory(key: ProductCategory): CategoryDefinition {
  return CATEGORIES[key] || CATEGORIES.unknown;
}

/**
 * Get all food-type categories.
 */
export function getFoodCategories(): CategoryDefinition[] {
  return Object.values(CATEGORIES).filter(c => c.ruleEngine === 'food');
}

/**
 * Get all cosmetic-type categories.
 */
export function getCosmeticCategories(): CategoryDefinition[] {
  return Object.values(CATEGORIES).filter(c => c.ruleEngine === 'cosmetic');
}
