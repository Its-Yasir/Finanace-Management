# Income Feature Implementation Guide

## Quick Fix for "Add Expense" Button

The add expense button wasn't working because of old `messageContainer` references. This has been **FIXED** in `expenses.html`.

## New Income Feature

I've added income tracking functionality to help you manage your balance properly.

### What's Been Added:

**1. In `app.js`:**

- `addIncome(incomeData)` - Add new income entry
- `getIncome()` - Fetch all income
- `calculateTotalIncome(income)` - Calculate total

**2. To Add to `dashboard.html`:**

Add "Add Income" button in Quick Actions section (around line 98):

```html
<button id="addIncomeBtn" class="btn btn-success">
  <i class="fas fa-plus-circle"></i> Add Income
</button>
```

Add Income Modal before closing `</body>` tag:

```html
<!-- Add Income Modal -->
<div id="incomeModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <h2 class="modal-title">Add Income</h2>
      <button type="button" class="modal-close" onclick="closeIncomeModal()">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <form id="incomeForm">
      <div class="modal-body">
        <div class="form-group">
          <label for="incomeAmount" class="form-label">
            <i class="fas fa-rupee-sign"></i> Amount *
          </label>
          <input
            type="number"
            id="incomeAmount"
            class="form-input"
            placeholder="0"
            min="1"
            required
          />
        </div>

        <div class="form-group">
          <label for="incomeSource" class="form-label">
            <i class="fas fa-briefcase"></i> Source *
          </label>
          <input
            type="text"
            id="incomeSource"
            class="form-input"
            placeholder="e.g., Salary, Freelance, etc."
            required
          />
        </div>

        <div class="form-group">
          <label for="incomeDate" class="form-label">
            <i class="fas fa-calendar"></i> Date *
          </label>
          <input type="date" id="incomeDate" class="form-input" required />
        </div>

        <div class="form-group">
          <label for="incomeDescription" class="form-label">
            <i class="fas fa-align-left"></i> Description
          </label>
          <input
            type="text"
            id="incomeDescription"
            class="form-input"
            placeholder="Optional notes"
          />
        </div>
      </div>

      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-secondary"
          onclick="closeIncomeModal()"
        >
          Cancel
        </button>
        <button type="submit" class="btn btn-success">
          <i class="fas fa-save"></i> Save Income
        </button>
      </div>
    </form>
  </div>
</div>
```

Update the dashboard script to import and use these functions:

```javascript
import {
  initApp,
  getExpenses,
  getIncome, // ADD THIS
  addIncome, // ADD THIS
  calculateTotalExpenses,
  calculateTotalIncome, // ADD THIS
  getRecentExpenses,
  formatCurrency,
  formatDate,
  getCategoryIcon,
  getCategoryBadge,
  showError,
  showSuccess, // ADD THIS
  hideLoading,
  showModal, // ADD THIS
  hideModal, // ADD THIS
} from "./app.js";

// Load dashboard data
async function loadDashboard() {
  try {
    await initApp();

    // Load BOTH expenses AND income
    const expenses = await getExpenses();
    const income = await getIncome();

    // Calculate totals
    const totalExpenses = calculateTotalExpenses(expenses);
    const totalIncome = calculateTotalIncome(income);
    const currentBalance = totalIncome - totalExpenses;

    // Update stats cards
    document.getElementById("totalIncome").textContent =
      formatCurrency(totalIncome);
    document.getElementById("totalExpenses").textContent =
      formatCurrency(totalExpenses);
    document.getElementById("currentBalance").textContent =
      formatCurrency(currentBalance);

    // ... rest of code
  } catch (error) {
    // ...
  }
}

// Add these functions
window.closeIncomeModal = function () {
  hideModal("incomeModal");
  document.getElementById("incomeForm").reset();
};

// Add income button handler
document.getElementById("addIncomeBtn").addEventListener("click", () => {
  document.getElementById("incomeDate").valueAsDate = new Date();
  showModal("incomeModal");
});

// Income form submit
document.getElementById("incomeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const incomeData = {
    amount: document.getElementById("incomeAmount").value,
    source: document.getElementById("incomeSource").value,
    date: document.getElementById("incomeDate").value,
    description: document.getElementById("incomeDescription").value,
  };

  try {
    await addIncome(incomeData);
    showSuccess("Income added successfully!");
    window.closeIncomeModal();
    loadDashboard(); // Reload to show new balance
  } catch (error) {
    showError(error.message);
  }
});
```

### Firestore Security Rules

Don't forget to add income collection rules:

```javascript
match /income/{income} {
  allow read: if request.auth != null &&
              request.auth.uid == resource.data.userId;

  allow create: if request.auth != null &&
                request.auth.uid == request.resource.data.userId;

  allow update, delete: if request.auth != null &&
                        request.auth.uid == resource.data.userId;
}
```

## Testing

1. **Refresh the app**
2. **Enable Firestore** (if not done yet)
3. **Add income** using the new button
4. **Add expenses** - they should now work properly
5. **Check balance** - it should calculate correctly
