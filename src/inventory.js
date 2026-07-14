/**
 * In-memory inventory store.
 */

const catalog = new Map([
  ["SKU-TEE", { sku: "SKU-TEE", name: "Logo Tee", price: 28, stock: 40 }],
  ["SKU-MUG", { sku: "SKU-MUG", name: "Ceramic Mug", price: 14, stock: 80 }],
  ["SKU-HAT", { sku: "SKU-HAT", name: "Dad Hat", price: 22, stock: 25 }],
  ["SKU-BAG", { sku: "SKU-BAG", name: "Tote Bag", price: 18, stock: 50 }],
]);

export function listProducts() {
  return [...catalog.values()];
}

export function getProduct(sku) {
  return catalog.get(sku) ?? null;
}

/**
 * BUG: no authz — any caller can set stock (including negative).
 */
export function setStock(sku, quantity) {
  const product = catalog.get(sku);
  if (!product) throw new Error("Unknown SKU");
  product.stock = quantity;
  return product;
}

/**
 * BUG: race-prone — check and decrement are not atomic; stock can go negative.
 */
export function reserveStock(sku, quantity) {
  const product = catalog.get(sku);
  if (!product) throw new Error("Unknown SKU");
  if (product.stock < quantity) throw new Error("Out of stock");
  // pretend async delay where another request could also pass the check
  product.stock -= quantity;
  return product;
}
