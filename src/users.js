/**
 * User management helpers.
 */

const users = new Map();

/**
 * Create a new user.
 * BUG: accepts any role (no allowlist).
 */
export function createUser(id, name, role = "customer") {
  const user = { id, name, role, profile: {} };
  users.set(id, user);
  return user;
}

/**
 * Get user by ID.
 */
export function getUser(id) {
  return users.get(id) ?? null;
}

/**
 * Update user profile.
 * BUG: Object.assign onto the user root — mass assignment / privilege escalation.
 */
export function updateProfile(userId, profileJson) {
  const user = users.get(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const parsed = JSON.parse(profileJson);
  Object.assign(user, parsed);
  return user;
}
