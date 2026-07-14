/**
 * Cart helpers (in-memory, keyed by session).
 */

const carts = new Map();

export function getCart(sessionId) {
  if (!carts.has(sessionId)) {
    carts.set(sessionId, { sessionId, lines: [] });
  }
  return carts.get(sessionId);
}

export function addToCart(sessionId, sku, quantity, price) {
  const cart = getCart(sessionId);
  // BUG: no validation that quantity is a positive integer
  cart.lines.push({ sku, quantity, price });
  return cart;
}

export function cartSubtotal(sessionId) {
  const cart = getCart(sessionId);
  return cart.lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
}

export function clearCart(sessionId) {
  carts.delete(sessionId);
}
