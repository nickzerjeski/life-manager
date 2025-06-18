/**
 * Returns a date formatted as `dd.mm.yyyy`.
 * @param date - Date to format.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE');
}

