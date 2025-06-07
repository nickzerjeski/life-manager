export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString + 'T00:00:00Z');
    return date.toLocaleDateString('de-DE', { timeZone: 'UTC' });
  } catch (e) {
    console.error('Invalid Date format:', dateString, e);
    return 'Invalid Date';
  }
};

export const formatCurrency = (amount: number | null | undefined): string => {
  if (typeof amount !== 'number') return 'N/A';
  return amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
};
