import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateLineTotal, applyCoupon } from "../src/pricing.js";
import { placeOrder, getOrder } from "../src/checkout.js";
import { listProducts } from "../src/inventory.js";

describe("pricing", () => {
  it("calculates line total", () => {
    assert.equal(calculateLineTotal(10, 2), 20);
  });

  it("applies SAVE10 coupon", () => {
    assert.equal(applyCoupon(100, "SAVE10"), 90);
  });
});

describe("checkout", () => {
  it("places and retrieves an order", () => {
    const order = placeOrder("user-1", [{ sku: "A", price: 5, quantity: 2 }], 10);
    assert.equal(getOrder(order.id).total, 10);
  });
});

describe("inventory", () => {
  it("lists catalog products", () => {
    assert.ok(listProducts().length >= 1);
  });
});

// Intentionally no tests for payments, webhooks, admin, analytics, refunds, receipts.
