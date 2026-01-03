/* ================================================
   FIREBASE AUTHENTICATION MODULE
   Handles user login, registration, and auth state
   ================================================ */

// Import Firebase modules (using CDN in HTML with type="module")
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* ===== FIREBASE CONFIGURATION ===== */
// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxEnU6_rOs5dKCsZJpzG6i1BrWLoXWXiM",
  authDomain: "finance-management-c1606.firebaseapp.com",
  projectId: "finance-management-c1606",
  storageBucket: "finance-management-c1606.firebasestorage.app",
  messagingSenderId: "218397477276",
  appId: "1:218397477276:web:80301ec7216e51f0142059",
  measurementId: "G-9CQDMQV4QX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ===== AUTHENTICATION FUNCTIONS ===== */

/**
 * Register a new user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise} Firebase auth user credentials
 */
export async function registerUser(email, password) {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Create user account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User registered successfully:", userCredential.user.uid);
    return userCredential;
  } catch (error) {
    // Handle specific Firebase auth errors
    console.error("Registration error:", error);

    switch (error.code) {
      case "auth/email-already-in-use":
        throw new Error(
          "This email is already registered. Please login instead."
        );
      case "auth/invalid-email":
        throw new Error("Please enter a valid email address.");
      case "auth/weak-password":
        throw new Error(
          "Password is too weak. Please use a stronger password."
        );
      default:
        throw new Error(
          error.message || "Registration failed. Please try again."
        );
    }
  }
}

/**
 * Login an existing user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise} Firebase auth user credentials
 */
export async function loginUser(email, password) {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Sign in user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User logged in successfully:", userCredential.user.uid);
    return userCredential;
  } catch (error) {
    // Handle specific Firebase auth errors
    console.error("Login error:", error);

    switch (error.code) {
      case "auth/user-not-found":
        throw new Error(
          "No account found with this email. Please register first."
        );
      case "auth/wrong-password":
        throw new Error("Incorrect password. Please try again.");
      case "auth/invalid-email":
        throw new Error("Please enter a valid email address.");
      case "auth/too-many-requests":
        throw new Error("Too many failed attempts. Please try again later.");
      default:
        throw new Error(error.message || "Login failed. Please try again.");
    }
  }
}

/**
 * Logout the currently authenticated user
 * @returns {Promise} Firebase sign out promise
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    console.log("User logged out successfully");

    // Redirect to login page
    window.location.href = "index.html";
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Logout failed. Please try again.");
  }
}

/**
 * Check if user is authenticated and return current user
 * @returns {Promise} Promise that resolves with current user or null
 */
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    // onAuthStateChanged returns unsubscribe function
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe(); // Unsubscribe after first check
        resolve(user);
      },
      (error) => {
        unsubscribe();
        reject(error);
      }
    );
  });
}

/**
 * Monitor authentication state changes
 * @param {Function} callback - Function to call when auth state changes
 * @returns {Function} Unsubscribe function
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Redirect to login page if user is not authenticated
 * Call this on protected pages (dashboard, expenses, reports)
 */
export async function requireAuth() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      // User not authenticated, redirect to login
      console.log("User not authenticated, redirecting to login");
      window.location.href = "index.html";
      return null;
    }

    // User is authenticated
    console.log("User authenticated:", user.uid);
    return user;
  } catch (error) {
    console.error("Auth check error:", error);
    window.location.href = "index.html";
    return null;
  }
}

/**
 * Redirect to dashboard if user is already authenticated
 * Call this on login/register page
 */
export async function redirectIfAuthenticated() {
  try {
    const user = await getCurrentUser();

    if (user) {
      // User already authenticated, redirect to dashboard
      console.log("User already authenticated, redirecting to dashboard");
      window.location.href = "dashboard.html";
    }
  } catch (error) {
    console.error("Auth check error:", error);
  }
}

// Export auth instance for use in other modules
export { auth };
