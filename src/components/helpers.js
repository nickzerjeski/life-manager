export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      // Ensure the date string is treated as UTC to avoid timezone issues
      const date = new Date(dateString + 'T00:00:00Z');
      return date.toLocaleDateString('de-DE', { timeZone: 'UTC' });
    } catch (e) {
      console.error("Invalid Date format:", dateString, e);
      return 'Invalid Date';
    }
  };
  
  export const formatCurrency = (amount) => {
    if (typeof amount !== 'number') return 'N/A';
    return amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  };
  