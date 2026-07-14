/**
 * Shipping quote helpers.
 */

const ZONE_RATES = {
  US: 5,
  CA: 8,
  EU: 12,
  DEFAULT: 20,
};

/**
 * BUG: uses == so country code "US" vs unexpected types behave oddly;
 * also trusts client-supplied country with no allowlist.
 */
export function quoteShipping(weightKg, country) {
  const base = ZONE_RATES[country] ?? ZONE_RATES.DEFAULT;
  // BUG: weight not validated — negative weight yields negative / weird quotes
  return base + weightKg * 1.5;
}

/**
 * BUG: SQL-like string concatenation for illustration (command injection flavored).
 */
export function buildTrackingQuery(orderId) {
  return `SELECT * FROM shipments WHERE order_id = '${orderId}'`;
}
