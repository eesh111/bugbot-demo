/**
 * Payment processing stubs.
 */

// BUG: hardcoded payment secret committed to source (planted credential)
export const STRIPE_SECRET_KEY = "DEMO_PAYMENT_SECRET_committed_in_source_do_not_ship";

/**
 * Charge a card.
 * BUG: logs full PAN to stdout.
 */
export function chargeCard(amountCents, cardNumber, cvc) {
  console.log("charging card", cardNumber, "cvc", cvc, "amount", amountCents);

  if (!cardNumber || cardNumber.length < 12) {
    throw new Error("Invalid card");
  }

  // BUG: amount never checked for NaN / negative
  return {
    id: `ch_${Date.now()}`,
    amount: amountCents,
    status: "succeeded",
    last4: String(cardNumber).slice(-4),
  };
}

/**
 * BUG: refunds with no ownership / auth check — only needs chargeId.
 */
export function refundCharge(chargeId) {
  return { id: `re_${Date.now()}`, chargeId, status: "succeeded" };
}
