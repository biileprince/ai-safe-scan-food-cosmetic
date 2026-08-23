/**
 * SafeScan — Assessment Tier Definitions
 * 
 * Maps each assessment category to its display properties.
 */

export type AssessmentTier =
  | 'generally_favorable'
  | 'use_with_caution'
  | 'high_concern'
  | 'insufficient_evidence';

export interface AssessmentDefinition {
  key: AssessmentTier;
  label: string;
  shortLabel: string;
  description: string;
  userAction: string;
  icon: string;          // Emoji for quick visual — replaced with custom icons later
  colorKey: 'favorable' | 'caution' | 'concern' | 'insufficient';
}

export const ASSESSMENTS: Record<AssessmentTier, AssessmentDefinition> = {
  generally_favorable: {
    key: 'generally_favorable',
    label: 'Generally Favorable',
    shortLabel: 'Favorable',
    description: 'No major concerns identified from available label information.',
    userAction: 'Normal use/consumption according to label.',
    icon: '✅',
    colorKey: 'favorable',
  },
  use_with_caution: {
    key: 'use_with_caution',
    label: 'Use With Caution',
    shortLabel: 'Caution',
    description: 'One or more issues require attention but do not automatically establish that the product is unsafe.',
    userAction: 'Review details and consider personal circumstances.',
    icon: '⚠️',
    colorKey: 'caution',
  },
  high_concern: {
    key: 'high_concern',
    label: 'High Concern',
    shortLabel: 'Concern',
    description: 'A serious concern or strong regulatory warning is identified.',
    userAction: 'Avoid until verified.',
    icon: '🚫',
    colorKey: 'concern',
  },
  insufficient_evidence: {
    key: 'insufficient_evidence',
    label: 'Insufficient Evidence',
    shortLabel: 'Insufficient',
    description: 'The image or label data is incomplete or too uncertain for a reliable assessment.',
    userAction: 'Retake photo or verify label manually.',
    icon: '❓',
    colorKey: 'insufficient',
  },
} as const;

/**
 * Get the assessment definition for a given tier key.
 */
export function getAssessment(tier: AssessmentTier): AssessmentDefinition {
  return ASSESSMENTS[tier];
}

/**
 * Get assessment color key → maps to Colors.status[colorKey] in theme.ts
 */
export function getAssessmentColor(tier: AssessmentTier): string {
  const colorMap: Record<AssessmentDefinition['colorKey'], string> = {
    favorable: '#10B981',
    caution: '#F59E0B',
    concern: '#EF4444',
    insufficient: '#8B5CF6',
  };
  return colorMap[ASSESSMENTS[tier].colorKey];
}
