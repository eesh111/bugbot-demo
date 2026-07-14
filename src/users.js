/**
 * User management helpers.
 */

const ALLOWED_ROLES = ["customer", "staff"];

const users = new Map();

/**
 * Create a new user with role validation.
 */
export function createUser(id, name, role = "customer") {
  if (!ALLOWED_ROLES.includes(role)) {
    throw new Error(`Invalid role: ${role}`);
  }

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
 * Update user profile with allowlisted fields only.
 */
export function updateProfile(userId, profileJson) {
  const user = users.get(userId);
  if (!user) {
    throw new Error("User not found");
  }

  let parsed;
  try {
    parsed = JSON.parse(profileJson);
  } catch {
    throw new Error("Invalid JSON");
  }

  const allowed = ["displayName", "email", "phone"];
  for (const key of Object.keys(parsed)) {
    if (!allowed.includes(key)) {
      throw new Error(`Field not allowed: ${key}`);
    }
  }

  user.profile = { ...user.profile, ...parsed };
  return user;
}
