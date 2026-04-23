export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);

export const formatDate = (date) => new Date(date).toLocaleDateString();

export const nightsBetween = (start, end) => {
  if (!start || !end) return 0;
  const checkIn = new Date(start);
  const checkOut = new Date(end);
  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) return 0;
  const diff = checkOut - checkIn;
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
