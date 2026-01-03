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
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
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
 * Register a new user with email, password, and display name
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {string} displayName - User's display name (username)
 * @returns {Promise} Firebase auth user credentials
 */
export async function registerUser(email, password, displayName) {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    if (!displayName || displayName.trim().length === 0) {
      throw new Error("Username is required");
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
    
    // Update user profile with display name
    await updateProfile(userCredential.user, {
      displayName: displayName.trim()
    });
    
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

/**
 * Update user display name
 * @param {string} newDisplayName - New display name
 * @returns {Promise} Update promise
 */
export async function updateUserDisplayName(newDisplayName) {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No user is currently signed in');
    }
    
    if (!newDisplayName || newDisplayName.trim().length === 0) {
      throw new Error('Display name cannot be empty');
    }
    
    await updateProfile(user, {
      displayName: newDisplayName.trim()
    });
    
    console.log('Display name updated successfully');
  } catch (error) {
    console.error('Error updating display name:', error);
    throw error;
  }
}

/**
 * Update user email
 * @param {string} newEmail - New email address
 * @param {string} currentPassword - Current password for reauthentication
 * @returns {Promise} Update promise
 */
export async function updateUserEmail(newEmail, currentPassword) {
  try {
    const user = auth.currentUser;
    
    if (!user || !user.email) {
      throw new Error('No user is currently signed in');
    }
    
    if (!newEmail) {
      throw new Error('New email is required');
    }
    
    if (!currentPassword) {
      throw new Error('Current password is required for reauthentication');
    }
    
    // Reauthenticate user before email update
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update email
    await updateEmail(user, newEmail);
    
    console.log('Email updated successfully');
  } catch (error) {
    console.error('Error updating email:', error);
    
    if (error.code === 'auth/wrong-password') {
      throw new Error('Current password is incorrect');
    } else if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email is already in use');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    }
    
    throw error;
  }
}

/**
 * Update user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} Update promise
 */
export async function updateUserPassword(currentPassword, newPassword) {
  try {
    const user = auth.currentUser;
    
    if (!user || !user.email) {
      throw new Error('No user is currently signed in');
    }
    
    if (!currentPassword) {
      throw new Error('Current password is required');
    }
    
    if (!newPassword) {
      throw new Error('New password is required');
    }
    
    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long');
    }
    
    // Reauthenticate user before password update
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Update password
    await updatePassword(user, newPassword);
    
    console.log('Password updated successfully');
  } catch (error) {
    console.error('Error updating password:', error);
    
    if (error.code === 'auth/wrong-password') {
      throw new Error('Current password is incorrect');
    } else if (error.code === 'auth/weak-password') {
      throw new Error('New password is too weak');
    }
    
    throw error;
  }
}

// Export auth instance for use in other modules
export { auth };
