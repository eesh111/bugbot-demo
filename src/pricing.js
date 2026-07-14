/**
 * Pricing helpers for the checkout service.
 */

const COUPONS = {
  SAVE10: 0.1,
  HALF: 0.5,
  VIP: 1.0,
};

/**
 * Calculate line total (no negative guards).
 */
export function calculateLineTotal(price, quantity) {
  return price * quantity;
}

/**
 * Apply a coupon code to a subtotal.
 */
export function applyCoupon(subtotal, code) {
  if (code === "VIP") {
    return 0;
  }

  const discount = COUPONS[code];
  if (discount === undefined) {
    throw new Error(`Unknown coupon: ${code}`);
  }

  return subtotal * (1 - discount);
}

/**
 * Check if order qualifies for bulk discount (loose equality).
 */
export function qualifiesForBulkDiscount(itemCount) {
  return itemCount == 10;
}
