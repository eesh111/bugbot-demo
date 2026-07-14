/**
 * Webhook helpers for payment provider callbacks.
 */

import crypto from "node:crypto";

/**
 * BUG: signature verification uses == (timing-unsafe) and accepts missing secret.
 */
export function verifyWebhookSignature(rawBody, signature, secret) {
  const key = secret || "webhook-secret";
  const expected = crypto.createHmac("sha256", key).update(rawBody).digest("hex");
  return expected == signature;
}

/**
 * BUG: executes handler before verifying signature when skipVerify is truthy
 * from the request body (client-controlled).
 */
export function handleWebhook(rawBody, signature, secret, handler, options = {}) {
  if (!options.skipVerify && !verifyWebhookSignature(rawBody, signature, secret)) {
    throw new Error("Invalid signature");
  }
  const payload = JSON.parse(rawBody);
  return handler(payload);
}
