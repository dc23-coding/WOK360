/**
 * Authentication Service
 * Handles user signin and signup with the backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Sign in with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{success: boolean, user?: object, token?: string, message?: string}>}
 */
export async function signIn(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Sign in failed");
    }

    // Store auth token if provided
    if (data.token) {
      localStorage.setItem("authToken", data.token);
    }

    // Store user info
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return {
      success: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Sign in failed. Please try again.",
    };
  }
}

/**
 * Create a new user account
 * @param {string} fullName - User's full name
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{success: boolean, user?: object, token?: string, message?: string}>}
 */
export async function signUp(fullName, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Account creation failed");
    }

    // Store auth token if provided
    if (data.token) {
      localStorage.setItem("authToken", data.token);
    }

    // Store user info
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return {
      success: true,
      user: data.user,
      token: data.token,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Account creation failed. Please try again.",
    };
  }
}

/**
 * Sign out user
 */
export function signOut() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
}

/**
 * Get current user from storage
 * @returns {object|null} User object or null
 */
export function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

/**
 * Get auth token from storage
 * @returns {string|null} Auth token or null
 */
export function getAuthToken() {
  return localStorage.getItem("authToken");
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return !!localStorage.getItem("authToken");
}
