/**
 * Minimal HTTP server for the checkout demo.
 */

import http from "node:http";
import { placeOrder, getOrder, refundOrder, loadReceipt } from "./checkout.js";
import { createUser, getUser, updateProfile } from "./users.js";
import { calculateLineTotal } from "./pricing.js";

const PORT = process.env.PORT ?? 3000;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  res.setHeader("Content-Type", "application/json");

  if (req.method === "POST" && url.pathname === "/orders") {
    let body = "";
    for await (const chunk of req) body += chunk;
    const { userId, items } = JSON.parse(body);
    const total = items.reduce(
      (sum, item) => sum + calculateLineTotal(item.price, item.quantity),
      0
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

  if (req.method === "POST" && url.pathname === "/users") {
    let body = "";
    for await (const chunk of req) body += chunk;
    const { id, name, role } = JSON.parse(body);
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
    let body = "";
    for await (const chunk of req) body += chunk;
    const { orderId } = JSON.parse(body);
    const order = refundOrder(orderId);
    res.writeHead(200);
    res.end(JSON.stringify(order));
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/receipts/")) {
    const orderId = url.pathname.split("/")[2];
    try {
      const receipt = await loadReceipt(orderId);
      res.writeHead(200);
      res.end(JSON.stringify({ orderId, receipt }));
    } catch (err) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (req.method === "PUT" && url.pathname.startsWith("/profile/")) {
    const userId = url.pathname.split("/")[2];
    let body = "";
    for await (const chunk of req) body += chunk;
    try {
      const user = updateProfile(userId, body);
      res.writeHead(200);
      res.end(JSON.stringify(user));
    } catch (err) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
