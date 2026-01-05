# Personal Expense Tracker (PET)

A modern, responsive web application for tracking personal expenses built with vanilla JavaScript and Firebase.

![Personal Expense Tracker](assets/logo.png)

## Features

- ✅ **User Authentication** - Secure email/password login and registration
- ✅ **Expense Management** - Full CRUD operations (Create, Read, Update, Delete)
- ✅ **Category Tracking** - Organize expenses by category (Food, Transport, etc.)
- ✅ **Data Visualization** - Interactive charts showing spending patterns
- ✅ **Light/Dark Theme** - Beautiful theme toggle with localStorage persistence
- ✅ **Fully Responsive** - Mobile-first design that works on all devices
- ✅ **Real-time Sync** - Data synced with Firebase Firestore
- ✅ **Modern UI** - Glassmorphism effects and smooth animations

## How It Works

### User Journey

1. **Authentication & Onboarding**

   - New users register with their email and password through a secure Firebase Authentication system
   - Existing users log in to access their personal expense data
   - All user data is isolated and protected - users can only access their own expenses

2. **Dashboard Overview**

   - Upon login, users land on the **Dashboard** which provides a financial snapshot
   - Three key metrics are displayed:
     - **Total Income**: Sum of all income entries added by the user
     - **Total Expenses**: Aggregate of all tracked expenses
     - **Current Balance**: Calculated as (Total Income - Total Expenses)
   - Recent transactions (last 5 expenses) are shown in a table
   - Quick action buttons provide shortcuts to add expenses or view detailed reports

3. **Income Management**

   - Click "Add Income" button on the dashboard to open the income modal
   - Enter income details: amount, source (e.g., Salary, Freelance), date, and optional description
   - Income is stored in Firestore and immediately reflects in the dashboard balance

4. **Expense Tracking**

   - Navigate to the **Expenses** page to manage all expenses
   - **Add New Expense**: Click "+ Add Expense" to open a modal form
     - Enter amount, select category (Food, Transport, Utilities, etc.)
     - Specify date and optional description
     - Submit to save to Firebase Firestore
   - **View All Expenses**: See complete expense list in a sortable table format
   - **Filter by Category**: Use the dropdown to filter expenses by specific categories
   - **Edit Expenses**: Click the edit icon to modify any expense details
   - **Delete Expenses**: Remove unwanted entries with confirmation prompt

5. **Reports & Analytics**

   - The **Reports** page provides visual insights into spending patterns
   - **Category Distribution**: Pie chart showing percentage breakdown by category
   - **Monthly Trends**: Bar chart displaying spending over the last 6 months
   - **Summary Statistics**: Quick stats including total expenses, number of categories, and average monthly spending
   - **Category Breakdown Table**: Detailed table with amounts, percentages, and visual progress bars

6. **Settings & Profile**
   - **Profile Management**: Update username (display name)
   - **Email Update**: Change login email with password verification
   - **Password Change**: Update password with current password confirmation
   - **Logout**: Sign out from all devices

### Data Flow & Architecture

```
User Action → JavaScript Event → Firebase API Call → Firestore Database
                                                           ↓
User Interface ← Data Processing ← Response ←──────────────┘
```

**Key Components:**

- **`auth.js`**: Handles all authentication operations (register, login, logout, profile updates)
- **`app.js`**: Core application logic including:
  - Firestore CRUD operations (Create, Read, Update, Delete)
  - Data calculations (totals, categories, monthly aggregates)
  - Chart rendering with Chart.js
  - Theme management (light/dark mode with localStorage)
  - UI helpers and utility functions
- **HTML Pages**: Each page focuses on specific functionality
  - `index.html`: Login/Register
  - `dashboard.html`: Financial overview
  - `expenses.html`: Expense management
  - `reports.html`: Analytics and charts
  - `settings.html`: User preferences

### Real-time Features

- **Auto-sync**: All data changes are immediately synced to Firebase Firestore
- **Live Updates**: Dashboard and reports refresh automatically when expenses are added/modified
- **State Persistence**: Dark/light theme preference saved in browser localStorage
- **Skeleton Loading**: Professional loading states while fetching data from Firebase

### Security Model

- **Authentication Required**: All pages (except login) require valid Firebase authentication
- **User Isolation**: Firestore queries filter by `userId` - users only see their own data
- **Route Protection**: Unauthenticated users are automatically redirected to login
- **Secure Operations**: Email and password updates require verification

### Responsive Design

The website automatically adapts to different screen sizes:

- **Mobile**: Optimized layout with touch-friendly buttons and compact navigation
- **Tablet**: Balanced layout with flexible grid systems
- **Desktop**: Full-featured interface with all elements visible

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Firebase (Authentication + Firestore)
- **Charts**: Chart.js
- **Icons**: FontAwesome
- **Fonts**: Google Fonts (Inter)

## Project Structure

```
Finanace Management/
├── assets/
│   ├── logo.png              # Application logo
│   ├── user.png              # Default user avatar
│   └── empty-state.png       # Empty state illustration
├── index.html                # Login/Register page
├── dashboard.html            # Main dashboard
├── expenses.html             # Expense management
├── reports.html              # Charts & analytics
├── styles.css                # Global styles & design system
├── auth.js                   # Firebase authentication
├── app.js                    # Core application logic
└── README.md                 # This file
```

## Setup Instructions

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A Firebase account (free tier is sufficient)
- A local web server (Live Server, Python, or Node.js)

### Step 1: Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** > **Email/Password** sign-in method
4. Create a **Firestore Database** (start in test mode)
5. Go to **Project Settings** > **General**
6. Scroll to "Your apps" and click the **Web** icon
7. Copy your Firebase configuration

### Step 2: Add Firebase Config

Replace the Firebase configuration in **TWO** files:

#### File 1: `auth.js` (lines 19-27)

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

#### File 2: `app.js` (lines 28-36)

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### Step 3: Run the Application

Choose one of these methods:

#### Option A: VS Code Live Server (Recommended)

1. Install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `index.html`
3. Select "Open with Live Server"

#### Option B: Python

```bash
python -m http.server 8000
```

Then open http://localhost:8000

#### Option C: Node.js

```bash
npx http-server -p 8000
```

Then open http://localhost:8000

### Step 4: Use the Application

1. **Register** a new account with email and password
2. **Login** with your credentials
3. **Add expenses** using the "+ Add Expense" button
4. **View dashboard** to see your financial overview
5. **Manage expenses** to edit or delete records
6. **View reports** to see charts and analytics
7. **Toggle theme** using the moon/sun icon

## Firebase Security Rules (Optional)

For better security, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /expenses/{expense} {
      // Only authenticated users can read their own expenses
      allow read: if request.auth != null &&
                  request.auth.uid == resource.data.userId;

      // Only authenticated users can create expenses
      allow create: if request.auth != null;

      // Only the owner can update or delete
      allow update, delete: if request.auth != null &&
                            request.auth.uid == resource.data.userId;
    }
  }
}
```

## Features Overview

### Dashboard

- View total income, expenses, and balance
- See recent transactions
- Quick action buttons

### Expense Management

- Add new expenses with amount, category, date, and description
- Edit existing expenses
- Delete expenses with confirmation
- Filter by category
- View filtered totals

### Reports & Analytics

- **Pie Chart**: Expenses by category with percentages
- **Bar Chart**: Monthly spending trends (last 6 months)
- **Summary Stats**: Total expenses, categories, average monthly
- **Category Table**: Detailed breakdown with progress bars

### Theme Support

- Light and dark modes
- Smooth transitions
- Saves preference to localStorage
- Applies globally across all pages

## Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

All layouts adapt automatically to screen size.

## Security

### Firebase API Keys

**Important:** The Firebase API keys visible in the code are **SAFE and INTENDED** to be public.

- Firebase API keys are identifiers, not secrets
- Security is enforced through **Firebase Authentication** and **Firestore Security Rules**
- This is the intended Firebase architecture for web apps

**For complete security information**, see [SECURITY.md](SECURITY.md)

### Critical Security Steps:

1. ⚠️ **Update Firestore Security Rules** (Required)
2. Enable only Email/Password authentication
3. Set up budget alerts
4. Review the [security checklist](SECURITY.md#-security-checklist)

## Browser Compatibility

✅ Chrome 100+  
✅ Firefox 100+  
✅ Safari 15+  
✅ Edge 100+

Requires modern browser with ES6 module support.

## Code Structure

### Authentication (`auth.js`)

- User registration
- User login
- Logout functionality
- Auth state management
- Route protection

### Application Logic (`app.js`)

- Firestore CRUD operations
- Data calculations and filtering
- Chart rendering
- Theme management
- UI helpers

### Styling (`styles.css`)

- CSS variables for theming
- Responsive utilities
- Component styles
- Animations
- Layout system

## Data Structure

Expenses are stored in Firestore with this structure:

```javascript
{
  userId: "user-unique-id",
  amount: 49.99,
  category: "Food",
  date: Timestamp,
  description: "Grocery shopping",
  createdAt: Timestamp
}
```

## License

This project is for educational purposes. Feel free to use and modify as needed.

## Support

For issues or questions:

1. Check that Firebase config is correct in both files
2. Ensure Firebase Authentication and Firestore are enabled
3. Check browser console for errors
4. Verify you're running on a local server (not file://)

## Future Enhancements

- Income tracking
- Budget goals
- Recurring expenses
- Export to CSV/PDF
- Receipt uploads
- Multi-currency support
- Expense sharing

---

**Built with ❤️ using Vanilla JavaScript**
