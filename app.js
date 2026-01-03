/* ================================================
   MAIN APPLICATION LOGIC
   Handles Firestore operations, UI interactions, and data visualization
   ================================================ */

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Import auth functions
import { requireAuth, logoutUser, auth } from './auth.js';

/* ===== FIREBASE CONFIGURATION ===== */
// Same configuration as in auth.js
const firebaseConfig = {
  apiKey: "AIzaSyDxEnU6_rOs5dKCsZJpzG6i1BrWLoXWXiM",
  authDomain: "finance-management-c1606.firebaseapp.com",
  projectId: "finance-management-c1606",
  storageBucket: "finance-management-c1606.firebasestorage.app",
  messagingSenderId: "218397477276",
  appId: "1:218397477276:web:80301ec7216e51f0142059",
  measurementId: "G-9CQDMQV4QX"
};

// Initialize Firebase (if not already initialized)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ===== GLOBAL VARIABLES ===== */
let currentUser = null;
let allExpenses = [];

/* ===== THEME MANAGEMENT ===== */

/**
 * Load saved theme from localStorage and apply it
 */
export function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Update theme toggle icon
  updateThemeIcon(savedTheme);
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Update theme toggle icon
  updateThemeIcon(newTheme);
}

/**
 * Update theme toggle button icon
 * @param {string} theme - Current theme ('light' or 'dark')
 */
function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'light' 
      ? '<i class="fas fa-moon"></i>' 
      : '<i class="fas fa-sun"></i>';
  }
}

/* ===== FIRESTORE CRUD OPERATIONS ===== */

/**
 * Add a new expense to Firestore
 * @param {Object} expenseData - Expense data {amount, category, date, description}
 * @returns {Promise} Document reference
 */
export async function addExpense(expenseData) {
  try {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Validate expense data
    if (!expenseData.amount || expenseData.amount <= 0) {
      throw new Error('Please enter a valid amount');
    }
    
    if (!expenseData.category) {
      throw new Error('Please select a category');
    }
    
    if (!expenseData.date) {
      throw new Error('Please select a date');
    }
    
    // Create expense document
    const expense = {
      userId: currentUser.uid,
      amount: parseFloat(expenseData.amount),
      category: expenseData.category,
      date: Timestamp.fromDate(new Date(expenseData.date)),
      description: expenseData.description || '',
      createdAt: Timestamp.now()
    };
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'expenses'), expense);
    console.log('Expense added with ID:', docRef.id);
    
    return docRef;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
}

/**
 * Get all expenses for the current user
 * @returns {Promise<Array>} Array of expense objects
 */
export async function getExpenses() {
  try {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Query expenses for current user
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', currentUser.uid),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const expenses = [];
    
    querySnapshot.forEach((doc) => {
      expenses.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Loaded ${expenses.length} expenses`);
    allExpenses = expenses;
    return expenses;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
}

/**
 * Update an existing expense
 * @param {string} expenseId - ID of the expense to update
 * @param {Object} updatedData - Updated expense data
 * @returns {Promise} Update promise
 */
export async function updateExpense(expenseId, updatedData) {
  try {
    if (!expenseId) {
      throw new Error('Expense ID is required');
    }
    
    // Prepare update object
    const updateObj = {};
    
    if (updatedData.amount) {
      updateObj.amount = parseFloat(updatedData.amount);
    }
    
    if (updatedData.category) {
      updateObj.category = updatedData.category;
    }
    
    if (updatedData.date) {
      updateObj.date = Timestamp.fromDate(new Date(updatedData.date));
    }
    
    if (updatedData.description !== undefined) {
      updateObj.description = updatedData.description;
    }
    
    // Update in Firestore
    const expenseRef = doc(db, 'expenses', expenseId);
    await updateDoc(expenseRef, updateObj);
    
    console.log('Expense updated:', expenseId);
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
}

/**
 * Delete an expense
 * @param {string} expenseId - ID of the expense to delete
 * @returns {Promise} Delete promise
 */
export async function deleteExpense(expenseId) {
  try {
    if (!expenseId) {
      throw new Error('Expense ID is required');
    }
    
    await deleteDoc(doc(db, 'expenses', expenseId));
    console.log('Expense deleted:', expenseId);
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
}

/* ===== DATA CALCULATIONS ===== */

/**
 * Calculate total expenses
 * @param {Array} expenses - Array of expense objects
 * @returns {number} Total amount
 */
export function calculateTotalExpenses(expenses) {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
}

/**
 * Calculate expenses grouped by category
 * @param {Array} expenses - Array of expense objects
 * @returns {Object} Object with categories as keys and totals as values
 */
export function calculateCategoryTotals(expenses) {
  const categoryTotals = {};
  
  expenses.forEach(expense => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount;
    } else {
      categoryTotals[expense.category] = expense.amount;
    }
  });
  
  return categoryTotals;
}

/**
 * Calculate monthly expenses for the last N months
 * @param {Array} expenses - Array of expense objects
 * @param {number} months - Number of months to include
 * @returns {Object} Object with month names as keys and totals as values
 */
export function calculateMonthlyTotals(expenses, months = 6) {
  const monthlyTotals = {};
  const now = new Date();
  
  // Initialize last N months
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    monthlyTotals[monthKey] = 0;
  }
  
  // Sum expenses by month
  expenses.forEach(expense => {
    const expenseDate = expense.date.toDate();
    const monthKey = expenseDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    
    if (monthlyTotals.hasOwnProperty(monthKey)) {
      monthlyTotals[monthKey] += expense.amount;
    }
  });
  
  return monthlyTotals;
}

/**
 * Get recent expenses
 * @param {Array} expenses - Array of expense objects
 * @param {number} limit - Number of expenses to return
 * @returns {Array} Array of recent expenses
 */
export function getRecentExpenses(expenses, limit = 5) {
  return expenses.slice(0, limit);
}

/**
 * Filter expenses by category
 * @param {Array} expenses - Array of expense objects
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered expenses
 */
export function filterByCategory(expenses, category) {
  if (!category || category === 'all') {
    return expenses;
  }
  return expenses.filter(expense => expense.category === category);
}

/* ===== FORMATTING HELPERS ===== */

/**
 * Format number as currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Format Firestore timestamp as readable date
 * @param {Timestamp} timestamp - Firestore timestamp
 * @returns {string} Formatted date string
 */
export function formatDate(timestamp) {
  if (!timestamp) return '';
  
  const date = timestamp.toDate();
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format date for input field (YYYY-MM-DD)
 * @param {Timestamp} timestamp - Firestore timestamp
 * @returns {string} Formatted date string for input
 */
export function formatDateForInput(timestamp) {
  if (!timestamp) return '';
  
  const date = timestamp.toDate();
  return date.toISOString().split('T')[0];
}

/* ===== UI HELPERS ===== */

/**
 * Show modal by ID
 * @param {string} modalId - ID of the modal to show
 */
export function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }
}

/**
 * Hide modal by ID
 * @param {string} modalId - ID of the modal to hide
 */
export function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
  }
}

/**
 * Show loading spinner
 */
export function showLoading() {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.classList.add('active');
  }
}

/**
 * Hide loading spinner
 */
export function hideLoading() {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.classList.remove('active');
  }
}

/* ===== TOAST NOTIFICATION SYSTEM ===== */

// Create toast container if it doesn't exist
function ensureToastContainer() {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duration in milliseconds (default: 5000)
 */
function showToast(message, type = 'info', duration = 5000) {
  const container = ensureToastContainer();
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.style.position = 'relative';
  
  // Icon based on type
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  
  // Titles based on type
  const titles = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info'
  };
  
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fas ${icons[type]}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${titles[type]}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close">
      <i class="fas fa-times"></i>
    </button>
    <div class="toast-progress"></div>
  `;
  
  // Add to container
  container.appendChild(toast);
  
  // Close button functionality
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    removeToast(toast);
  });
  
  // Auto remove after duration
  setTimeout(() => {
    removeToast(toast);
  }, duration);
}

/**
 * Remove toast with animation
 * @param {HTMLElement} toast - Toast element to remove
 */
function removeToast(toast) {
  if (!toast || !toast.parentElement) return;
  
  toast.classList.add('hiding');
  
  // Remove from DOM after animation
  setTimeout(() => {
    if (toast.parentElement) {
      toast.parentElement.removeChild(toast);
    }
  }, 300);
}

/**
 * Show error toast
 * @param {string} message - Error message to display
 */
export function showError(message) {
  showToast(message, 'error', 6000);
}

/**
 * Show success toast
 * @param {string} message - Success message to display
 */
export function showSuccess(message) {
  showToast(message, 'success', 4000);
}

/**
 * Show warning toast
 * @param {string} message - Warning message to display
 */
export function showWarning(message) {
  showToast(message, 'warning', 5000);
}

/**
 * Show info toast
 * @param {string} message - Info message to display
 */
export function showInfo(message) {
  showToast(message, 'info', 4000);
}

/**
 * Get category icon
 * @param {string} category - Category name
 * @returns {string} FontAwesome icon class
 */
export function getCategoryIcon(category) {
  const icons = {
    'Food': 'fa-utensils',
    'Transport': 'fa-car',
    'Utilities': 'fa-bolt',
    'Entertainment': 'fa-film',
    'Shopping': 'fa-shopping-bag',
    'Healthcare': 'fa-heart-pulse',
    'Other': 'fa-circle'
  };
  
  return icons[category] || icons['Other'];
}

/**
 * Get category color class
 * @param {string} category - Category name
 * @returns {string} Badge class name
 */
export function getCategoryBadge(category) {
  return `badge badge-${category.toLowerCase()}`;
}

/* ===== CHART RENDERING (Chart.js) ===== */

/**
 * Render pie chart for expenses by category
 * @param {Object} categoryData - Object with categories and amounts
 * @param {string} canvasId - ID of canvas element
 */
export function renderPieChart(categoryData, canvasId = 'categoryChart') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Destroy existing chart if it exists
  if (window.categoryChartInstance) {
    window.categoryChartInstance.destroy();
  }
  
  // Prepare data
  const labels = Object.keys(categoryData);
  const data = Object.values(categoryData);
  
  // Category colors
  const colors = {
    'Food': '#ef4444',
    'Transport': '#3b82f6',
    'Utilities': '#f59e0b',
    'Entertainment': '#a855f7',
    'Shopping': '#ec4899',
    'Healthcare': '#10b981',
    'Other': '#6b7280'
  };
  
  const backgroundColors = labels.map(label => colors[label] || colors['Other']);
  
  // Create chart
  window.categoryChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColors,
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = formatCurrency(context.parsed);
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

/**
 * Render bar chart for monthly spending
 * @param {Object} monthlyData - Object with months and amounts
 * @param {string} canvasId - ID of canvas element
 */
export function renderBarChart(monthlyData, canvasId = 'monthlyChart') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Destroy existing chart if it exists
  if (window.monthlyChartInstance) {
    window.monthlyChartInstance.destroy();
  }
  
  // Prepare data
  const labels = Object.keys(monthlyData);
  const data = Object.values(monthlyData);
  
  // Create chart
  window.monthlyChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Monthly Spending',
        data: data,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatCurrency(value);
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return formatCurrency(context.parsed.y);
            }
          }
        }
      }
    }
  });
}

/* ===== INITIALIZATION ===== */

/**
 * Initialize the app - call this on page load for protected pages
 */
export async function initApp() {
  try {
    // Load theme
    loadTheme();
    
    // Check authentication
    currentUser = await requireAuth();
    
    if (!currentUser) {
      return; // requireAuth will redirect
    }
    
    // Setup theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          await logoutUser();
        } catch (error) {
          showError(error.message);
        }
      });
    }
    
    // Display user name/email in navbar if element exists
    const userEmailElement = document.getElementById('userEmail');
    const userNameElement = document.querySelector('.user-name');
    
    if (userEmailElement && currentUser.email) {
      userEmailElement.textContent = currentUser.email;
    }
    
    if (userNameElement && currentUser.displayName) {
      userNameElement.textContent = currentUser.displayName;
    } else if (userNameElement && currentUser.email) {
      // Fallback to email if no display name
      userNameElement.textContent = currentUser.email.split('@')[0];
    }
    
    console.log('App initialized successfully');
  } catch (error) {
    console.error('App initialization error:', error);
    showError('Failed to initialize app');
  }
}

// Export current user getter
export function getUser() {
  return currentUser;
}

// Export all expenses getter
export function getAllExpenses() {
  return allExpenses;
}
