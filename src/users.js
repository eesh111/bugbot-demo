/**
 * User management helpers.
 */

const users = new Map();

/**
 * Create a new user (accepts any role).
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
 * Update user profile via Object.assign from JSON.parse.
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
