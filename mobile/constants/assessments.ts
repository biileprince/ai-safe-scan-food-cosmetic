/**
 * SafeScan — Assessment Tier Definitions
 */

export type AssessmentTier = 
  | 'generally_favorable'
  | 'use_with_caution'
  | 'high_concern'
  | 'insufficient_evidence';

export interface AssessmentDefinition {
  label: string;
  shortLabel: string;
  description: string;
  userAction: string;
  colorKey: 'favorable' | 'caution' | 'concern' | 'insufficient';
}

export const ASSESSMENTS: Record<AssessmentTier, AssessmentDefinition> = {
  generally_favorable: {
    label: 'Generally Favorable',
    shortLabel: 'Favorable',
    description: 'Based on available label information, no major safety concerns were identified for the declared ingredients.',
    userAction: 'This product appears suitable based on available evidence.',
    colorKey: 'favorable',
  },
  use_with_caution: {
    label: 'Use With Caution',
    shortLabel: 'Caution',
    description: 'Some ingredients require attention. The issues do not prove the product is unsafe, but warrant awareness.',
    userAction: 'Review the flagged ingredients and consider your personal sensitivities.',
    colorKey: 'caution',
  },
  high_concern: {
    label: 'High Concern',
    shortLabel: 'Concern',
    description: 'One or more ingredients are flagged as high-risk, restricted, or match your allergen profile.',
    userAction: 'Review the specific concerns carefully before using this product.',
    colorKey: 'concern',
  },
  insufficient_evidence: {
    label: 'Insufficient Evidence',
    shortLabel: 'Uncertain',
    description: 'The label image was unclear or the ingredient list could not be reliably extracted.',
    userAction: 'Try rescanning with better lighting or a clearer image.',
    colorKey: 'insufficient',
  },
};

export function getAssessmentColor(tier: AssessmentTier): string {
  const { Colors } = require('./theme');
  const def = ASSESSMENTS[tier];
  if (!def) return Colors.gray[500];

  const map: Record<string, string> = {
    favorable: Colors.status.favorable,
    caution: Colors.status.caution,
    concern: Colors.status.concern,
    insufficient: Colors.status.insufficient,
  };

  return map[def.colorKey] || Colors.gray[500];
}

export function getAssessmentBgColor(tier: AssessmentTier): string {
  const { Colors } = require('./theme');
  const def = ASSESSMENTS[tier];
  if (!def) return Colors.gray[50];

  const map: Record<string, string> = {
    favorable: Colors.status.favorableBg,
    caution: Colors.status.cautionBg,
    concern: Colors.status.concernBg,
    insufficient: Colors.status.insufficientBg,
  };

  return map[def.colorKey] || Colors.gray[50];
}
