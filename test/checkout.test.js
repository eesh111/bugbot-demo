import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { calculateLineTotal, applyCoupon, qualifiesForBulkDiscount } from "../src/pricing.js";
import { placeOrder, getOrder } from "../src/checkout.js";

describe("pricing", () => {
  it("calculates line total", () => {
    assert.equal(calculateLineTotal(10, 2), 20);
  });

  it("rejects negative price", () => {
    assert.throws(() => calculateLineTotal(-1, 1), /negative/);
  });

  it("applies SAVE10 coupon", () => {
    assert.equal(applyCoupon(100, "SAVE10"), 90);
  });

  it("qualifies for bulk discount at exactly 10 items", () => {
    assert.equal(qualifiesForBulkDiscount(10), true);
    assert.equal(qualifiesForBulkDiscount(9), false);
  });
});

describe("checkout", () => {
  it("places and retrieves an order", () => {
    const order = placeOrder("user-1", [{ sku: "A", price: 5, quantity: 2 }], 10);
    assert.equal(getOrder(order.id).total, 10);
  });
});
