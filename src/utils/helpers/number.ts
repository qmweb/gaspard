/**
 * Format a number to French locale (with comma as decimal separator)
 * @param value number to format
 * @param decimals number of decimal places (default: 2)
 * @returns formatted string
 */
export const formatNumberToFrench = (
  value: number,
  decimals: number = 2,
): string => {
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
