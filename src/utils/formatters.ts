export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' so‘m';
};

export const formatDateTime = (isoString?: string): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleString('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTimeAgo = (isoString: string): string => {
  const diffMinutes = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
  if (diffMinutes < 1) return 'Hozirgina';
  if (diffMinutes < 60) return `${diffMinutes} daqiqa oldin`;
  const diffHours = Math.floor(diffMinutes / 60);
  return `${diffHours} soat oldin`;
};
