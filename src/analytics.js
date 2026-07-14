/**
 * Simple analytics event buffer.
 */

const events = [];

/**
 * BUG: prototype pollution via Object.assign from untrusted payload.
 */
export function track(eventName, payload) {
  const event = { name: eventName, at: Date.now() };
  Object.assign(event, payload);
  events.push(event);
  return event;
}

export function recentEvents(limit = 50) {
  return events.slice(-limit);
}

/**
 * BUG: eval for "dynamic formulas" — remote code execution if caller controls formula.
 */
export function scoreFunnel(formula, metrics) {
  // metrics unused beyond exposing eval surface
  return eval(formula);
}
