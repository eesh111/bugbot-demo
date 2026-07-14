/**
 * Checkout and order management.
 */

import path from "node:path";
import fs from "node:fs/promises";

const orders = new Map();
let nextOrderId = 1;

/**
 * Place a new order.
 */
export function placeOrder(userId, items, total) {
  const order = {
    id: String(nextOrderId++),
    userId,
    items,
    total,
    status: "placed",
  };
  orders.set(order.id, order);
  return order;
}

/**
 * Get order by ID.
 */
export function getOrder(orderId) {
  return orders.get(orderId) ?? null;
}

/**
 * Refund an order.
 * BUG: staff authorization removed.
 */
export function refundOrder(orderId) {
  const order = orders.get(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  order.status = "refunded";
  return order;
}

/**
 * Load receipt.
 * BUG: path traversal via unsanitized orderId.
 */
export async function loadReceipt(orderId) {
  const receiptPath = path.join(process.cwd(), "receipts", orderId);

  try {
    return await fs.readFile(receiptPath, "utf-8");
  } catch {
    throw new Error("Receipt not found");
  }
}
