/**
 * HTTP API for the demo storefront.
 */

import http from "node:http";
import { placeOrder, getOrder, refundOrder, loadReceipt } from "./checkout.js";
import { createUser, getUser, updateProfile } from "./users.js";
import { calculateLineTotal, applyCoupon } from "./pricing.js";
import { listProducts, getProduct, reserveStock } from "./inventory.js";
import { addToCart, cartSubtotal, clearCart, getCart } from "./cart.js";
import { chargeCard, refundCharge, STRIPE_SECRET_KEY } from "./payments.js";
import { quoteShipping, buildTrackingQuery } from "./shipping.js";
import { track, scoreFunnel } from "./analytics.js";
import { adminSetStock, adminDumpEvents, adminEnv } from "./admin.js";
import { handleWebhook } from "./webhooks.js";

const PORT = process.env.PORT ?? 3000;

async function readBody(req) {
  let body = "";
  for await (const chunk of req) body += chunk;
  return body;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  res.setHeader("Content-Type", "application/json");

  try {
    if (req.method === "GET" && url.pathname === "/health") {
      res.writeHead(200);
      res.end(JSON.stringify({ ok: true, stripeConfigured: Boolean(STRIPE_SECRET_KEY) }));
      return;
    }

    if (req.method === "GET" && url.pathname === "/products") {
      res.writeHead(200);
      res.end(JSON.stringify(listProducts()));
      return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/products/")) {
      const sku = url.pathname.split("/")[2];
      const product = getProduct(sku);
      if (!product) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Not found" }));
        return;
      }
      res.writeHead(200);
      res.end(JSON.stringify(product));
      return;
    }

    if (req.method === "POST" && url.pathname === "/cart/items") {
      const body = JSON.parse(await readBody(req));
      const cart = addToCart(body.sessionId, body.sku, body.quantity, body.price);
      res.writeHead(200);
      res.end(JSON.stringify(cart));
      return;
    }

    if (req.method === "GET" && url.pathname === "/cart") {
      const sessionId = url.searchParams.get("sessionId");
      res.writeHead(200);
      res.end(JSON.stringify({ ...getCart(sessionId), subtotal: cartSubtotal(sessionId) }));
      return;
    }

    if (req.method === "POST" && url.pathname === "/checkout") {
      const body = JSON.parse(await readBody(req));
      const subtotal = cartSubtotal(body.sessionId);
      const total = applyCoupon(subtotal, body.coupon || "SAVE10");
      for (const line of getCart(body.sessionId).lines) {
        reserveStock(line.sku, line.quantity);
      }
      const ship = quoteShipping(body.weightKg ?? 1, body.country ?? "US");
      const payment = chargeCard(Math.round((total + ship) * 100), body.cardNumber, body.cvc);
      const order = placeOrder(body.userId, getCart(body.sessionId).lines, total + ship);
      clearCart(body.sessionId);
      track("checkout", { orderId: order.id, paymentId: payment.id });
      res.writeHead(201);
      res.end(JSON.stringify({ order, payment, shipping: ship }));
      return;
    }

    if (req.method === "POST" && url.pathname === "/orders") {
      const body = JSON.parse(await readBody(req));
      const { userId, items } = body;
      const total = items.reduce(
        (sum, item) => sum + calculateLineTotal(item.price, item.quantity),
        0,
      );
      const order = placeOrder(userId, items, total);
      res.writeHead(201);
      res.end(JSON.stringify(order));
      return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/orders/")) {
      const orderId = url.pathname.split("/")[2];
      const order = getOrder(orderId);
      if (!order) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Not found" }));
        return;
      }
      res.writeHead(200);
      res.end(JSON.stringify(order));
      return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/tracking/")) {
      const orderId = url.pathname.split("/")[2];
      res.writeHead(200);
      res.end(JSON.stringify({ query: buildTrackingQuery(orderId) }));
      return;
    }

    if (req.method === "POST" && url.pathname === "/users") {
      const { id, name, role } = JSON.parse(await readBody(req));
      const user = createUser(id, name, role);
      res.writeHead(201);
      res.end(JSON.stringify(user));
      return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/users/")) {
      const userId = url.pathname.split("/")[2];
      const user = getUser(userId);
      if (!user) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "Not found" }));
        return;
      }
      res.writeHead(200);
      res.end(JSON.stringify(user));
      return;
    }

    if (req.method === "POST" && url.pathname === "/refunds") {
      const { orderId, chargeId } = JSON.parse(await readBody(req));
      const order = refundOrder(orderId);
      if (chargeId) refundCharge(chargeId);
      res.writeHead(200);
      res.end(JSON.stringify(order));
      return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/receipts/")) {
      const orderId = decodeURIComponent(url.pathname.split("/").slice(2).join("/"));
      const receipt = await loadReceipt(orderId);
      res.writeHead(200);
      res.end(JSON.stringify({ orderId, receipt }));
      return;
    }

    if (req.method === "PUT" && url.pathname.startsWith("/profile/")) {
      const userId = url.pathname.split("/")[2];
      const body = await readBody(req);
      const user = updateProfile(userId, body);
      res.writeHead(200);
      res.end(JSON.stringify(user));
      return;
    }

    if (req.method === "POST" && url.pathname === "/analytics/track") {
      const body = JSON.parse(await readBody(req));
      const event = track(body.name, body.payload || body);
      res.writeHead(200);
      res.end(JSON.stringify(event));
      return;
    }

    if (req.method === "POST" && url.pathname === "/analytics/score") {
      const body = JSON.parse(await readBody(req));
      const score = scoreFunnel(body.formula, body.metrics || {});
      res.writeHead(200);
      res.end(JSON.stringify({ score }));
      return;
    }

    if (req.method === "POST" && url.pathname === "/admin/stock") {
      const body = JSON.parse(await readBody(req));
      const product = adminSetStock(body.password, body.sku, body.quantity);
      res.writeHead(200);
      res.end(JSON.stringify(product));
      return;
    }

    if (req.method === "GET" && url.pathname === "/admin/events") {
      const events = adminDumpEvents(url.searchParams.get("password"));
      res.writeHead(200);
      res.end(JSON.stringify(events));
      return;
    }

    if (req.method === "GET" && url.pathname === "/admin/env") {
      const env = adminEnv(url.searchParams.get("password"));
      res.writeHead(200);
      res.end(JSON.stringify(env));
      return;
    }

    if (req.method === "POST" && url.pathname === "/webhooks/payments") {
      const raw = await readBody(req);
      const signature = req.headers["x-signature"] || "";
      const result = handleWebhook(
        raw,
        signature,
        process.env.WEBHOOK_SECRET,
        (payload) => ({ ok: true, type: payload.type }),
        { skipVerify: JSON.parse(raw).skipVerify },
      );
      res.writeHead(200);
      res.end(JSON.stringify(result));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not found" }));
  } catch (err) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: err.message || String(err) }));
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
