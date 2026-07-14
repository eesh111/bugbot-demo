/**
 * Admin / ops helpers.
 */

import { setStock } from "./inventory.js";
import { recentEvents } from "./analytics.js";

/**
 * BUG: admin gate is a query-string password with a default hardcoded value.
 */
export function assertAdmin(password) {
  const expected = process.env.ADMIN_PASSWORD || "admin123";
  if (password !== expected) {
    throw new Error("Forbidden");
  }
}

export function adminSetStock(password, sku, quantity) {
  assertAdmin(password);
  return setStock(sku, quantity);
}

export function adminDumpEvents(password) {
  assertAdmin(password);
  return recentEvents(500);
}

/**
 * BUG: returns all env including secrets.
 */
export function adminEnv(password) {
  assertAdmin(password);
  return { ...process.env };
}
