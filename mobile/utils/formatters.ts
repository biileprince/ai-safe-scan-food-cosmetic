/**
 * SafeScan — Formatters
 * 
 * Pure utility functions for formatting dates, numbers, and strings.
 */

/**
 * Format a date string into a human-readable format
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

/**
 * Format a confidence value (0.0 – 1.0) as a percentage string
 */
export function formatConfidence(confidence: number | null | undefined): string {
  if (confidence == null) return '—';
  return `${Math.round(confidence * 100)}%`;
}

/**
 * Returns a verbal label for a confidence score
 */
export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.9) return 'Very High';
  if (confidence >= 0.7) return 'High';
  if (confidence >= 0.5) return 'Moderate';
  if (confidence >= 0.3) return 'Low';
  return 'Very Low';
}

/**
 * Truncate long text with ellipsis
 */
export function truncate(text: string, maxLength: number = 60): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + '…';
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Format product category into display name
 */
export function formatCategory(category: string): string {
  const map: Record<string, string> = {
    food: 'Food',
    beverage: 'Beverage',
    skincare: 'Skincare',
    haircare: 'Hair Care',
    makeup: 'Makeup',
    soap: 'Soap',
    body_lotion: 'Body Lotion',
    unknown: 'Unknown',
  };
  return map[category] || capitalize(category.replace(/_/g, ' '));
}

/**
 * Format severity level into display name
 */
export function formatSeverity(severity: string): string {
  const map: Record<string, string> = {
    critical: 'Critical',
    high: 'High',
    moderate: 'Moderate',
    low: 'Low',
    none: 'None',
  };
  return map[severity] || capitalize(severity);
}
