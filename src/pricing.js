/**
 * Pricing helpers for the checkout service.
 */

const COUPONS = {
  SAVE10: 0.1,
  HALF: 0.5,
};

/**
 * Calculate line total with quantity guard.
 */
export function calculateLineTotal(price, quantity) {
  if (price < 0) {
    throw new Error("Price cannot be negative");
  }
  if (quantity < 0) {
    throw new Error("Quantity cannot be negative");
  }
  return price * quantity;
}

/**
 * Apply a coupon code to a subtotal.
 */
export function applyCoupon(subtotal, code) {
  if (subtotal < 0) {
    throw new Error("Subtotal cannot be negative");
  }

  const discount = COUPONS[code];
  if (discount === undefined) {
    throw new Error(`Unknown coupon: ${code}`);
  }

  return subtotal * (1 - discount);
}

/**
 * Check if order qualifies for bulk discount (strict equality).
 */
export function qualifiesForBulkDiscount(itemCount) {
  return itemCount === 10;
}
