// Skeleton Loading Helper Functions for App.js

/**
 * Show skeleton loading for stats cards
 */
export function showStatsSkeletons() {
  const statsGrid = document.querySelector('.stats-grid');
  if (!statsGrid) return;
  
  statsGrid.innerHTML = `
    <div class="skeleton-stat-card">
      <div class="skeleton skeleton-icon"></div>
      <div class="skeleton skeleton-text" style="width: 60%;"></div>
      <div class="skeleton skeleton-text-lg" style="width: 80%;"></div>
    </div>
    <div class="skeleton-stat-card">
      <div class="skeleton skeleton-icon"></div>
      <div class="skeleton skeleton-text" style="width: 60%;"></div>
      <div class="skeleton skeleton-text-lg" style="width: 80%;"></div>
    </div>
    <div class="skeleton-stat-card">
      <div class="skeleton skeleton-icon"></div>
      <div class="skeleton skeleton-text" style="width: 60%;"></div>
      <div class="skeleton skeleton-text-lg" style="width: 80%;"></div>
    </div>
  `;
}

/**
 * Show skeleton loading for table
 */
export function showTableSkeleton(containerId, rows = 5) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  let html = `
    <div class="table-container">
      <table class="skeleton-table">
        <tbody>
  `;
  
  for (let i = 0; i < rows; i++) {
    html += `
      <tr class="skeleton-table-row">
        <td class="skeleton-table-cell">
          <div class="skeleton skeleton-text" style="width: 80px;"></div>
        </td>
        <td class="skeleton-table-cell">
          <div class="skeleton skeleton-text" style="width: 100px;"></div>
        </td>
        <td class="skeleton-table-cell">
          <div class="skeleton skeleton-text" style="width: 150px;"></div>
        </td>
        <td class="skeleton-table-cell">
          <div class="skeleton skeleton-text" style="width: 80px; margin-left: auto;"></div>
        </td>
      </tr>
    `;
  }
  
  html += `
        </tbody>
      </table>
    </div>
  `;
  
  container.innerHTML = html;
}

// Add these exports to your app.js file
// Then import and use them in your pages:

/*
USAGE EXAMPLE in dashboard.html or expenses.html:

import { showStatsSkeletons, showTableSkeleton } from './app.js';

async function loadDashboard() {
  // Show skeleton immediately
  showStatsSkeletons();
  showTableSkeleton('recentExpensesContainer', 5);
  
  try {
    await initApp();
    
    // Load actual data
    const expenses = await getExpenses();
    
    // Update with real data (skeletons automatically replaced)
    displayExpenses(expenses);
    updateStats(expenses);
    
  } catch (error) {
    // Handle error
  }
}
*/
