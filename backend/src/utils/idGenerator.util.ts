export function generateOrderNumber() {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const year = new Date().getFullYear();
  return `ORD-${year}-${random}`;
}

export function generateProductCode() {
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PIL-${random}`;
}
