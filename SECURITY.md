# Firebase Security Guide for Personal Expense Tracker

## 🔐 Understanding Firebase Security

### Is it Safe to Expose Firebase API Keys?

**YES! Firebase API keys in client-side code are safe.** Here's why:

1. **API Keys are NOT Secret**

   - Firebase API keys are identifiers, not authorization tokens
   - They identify your Firebase project, similar to "username"
   - They're designed to be included in public code

2. **Security is Enforced Through**:
   - ✅ Firebase Authentication (who can access)
   - ✅ Security Rules (what they can access)
   - ✅ App Check (prevents abuse)
   - ❌ NOT through hiding API keys

### Official Firebase Statement

> "Unlike how API keys are typically used, API keys for Firebase services are not used to control access to backend resources; that can only be done with Firebase Security Rules. Usually, you need to fastidiously guard API keys; however, API keys for Firebase services are ok to include in code or checked-in config files."
>
> — [Firebase Documentation](https://firebase.google.com/docs/projects/api-keys)

---

## 🛡️ Securing Your Firebase Project

### 1. **Firestore Security Rules** (MOST IMPORTANT)

Your current rules should restrict data access to authenticated users only.

#### Recommended Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Expenses Collection
    match /expenses/{expenseId} {
      // Allow users to read only their own expenses
      allow read: if request.auth != null &&
                  request.auth.uid == resource.data.userId;

      // Allow authenticated users to create expenses
      // Ensure userId matches authenticated user
      allow create: if request.auth != null &&
                    request.auth.uid == request.resource.data.userId;

      // Allow users to update only their own expenses
      allow update: if request.auth != null &&
                    request.auth.uid == resource.data.userId;

      // Allow users to delete only their own expenses
      allow delete: if request.auth != null &&
                    request.auth.uid == resource.data.userId;
    }

    // Block all other collections by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

#### How to Apply Rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **finance-management-c1606**
3. Navigate to **Firestore Database** → **Rules** tab
4. Paste the rules above
5. Click **Publish**

---

### 2. **Firebase Authentication Best Practices**

✅ **Current Implementation:**

- Email/Password authentication ✓
- User-specific data (userId field) ✓
- Session management ✓

✅ **Additional Recommendations:**

#### Enable Email Verification (Optional):

```javascript
import { sendEmailVerification } from "firebase/auth";

// After registration
await sendEmailVerification(user);
```

#### Add Password Reset:

```javascript
import { sendPasswordResetEmail } from "firebase/auth";

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}
```

---

### 3. **Restrict Authentication Methods**

In Firebase Console → Authentication → Sign-in method:

1. ✅ **Enable** only what you use:
   - Email/Password ✓
2. ❌ **Disable** unused providers:

   - Google
   - Facebook
   - Phone
   - Anonymous

3. **Authorized Domains**:
   - Add only domains where your app runs
   - Remove unused domains

---

### 4. **Enable App Check** (Recommended for Production)

App Check protects your backend from abuse by verifying requests come from your authentic app.

#### Setup Steps:

1. Go to Firebase Console → **App Check**
2. Register your web app
3. Choose a provider:
   - **reCAPTCHA v3** (easiest for web)
   - reCAPTCHA Enterprise
4. Add to your code:

```javascript
// Add to auth.js or app.js
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Initialize App Check
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("YOUR_RECAPTCHA_SITE_KEY"),
  isTokenAutoRefreshEnabled: true,
});
```

---

### 5. **Usage Quotas & Billing Alerts**

Prevent unexpected costs:

1. Go to Firebase Console → **Usage and billing**
2. Set up **budget alerts**
3. Monitor:
   - Firestore reads/writes
   - Authentication users
   - Storage usage

#### Free Tier Limits:

- Firestore: 50K reads/day, 20K writes/day
- Auth: Unlimited users
- Storage: 1GB

---

### 6. **Environment Variables** (For Production)

While Firebase config can be public, you might want to use environment variables for organization:

#### Create `.env` file (don't commit to Git):

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
# ... etc
```

#### Add to `.gitignore`:

```
.env
.env.local
.env.production
```

#### Use in code:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... etc
};
```

**Note:** This is for code organization, NOT security. The keys will still be visible in the built app.

---

## 🚨 Security Checklist

Use this checklist to ensure your app is secure:

### Authentication

- [x] Email/Password auth enabled
- [ ] Email verification enabled (optional)
- [ ] Password reset implemented
- [x] Users can only access their own data

### Firestore Rules

- [ ] Security rules published
- [ ] Users can only read/write their own expenses
- [ ] userId matches authenticated user
- [ ] Default deny rule for all other collections

### App Protection

- [ ] App Check enabled (recommended)
- [ ] Authorized domains configured
- [ ] Unused auth providers disabled

### Monitoring

- [ ] Budget alerts set up
- [ ] Usage monitoring enabled
- [ ] Error tracking configured (optional)

### Code Security

- [x] No hardcoded sensitive data (passwords, tokens)
- [x] Input validation on forms
- [x] XSS prevention (using textContent, not innerHTML for user data)

---

## ⚠️ What NOT to Expose

While Firebase config is safe to expose, **NEVER** expose:

❌ **Firebase Admin SDK credentials** (service account JSON)  
❌ **Server-side API keys**  
❌ **OAuth client secrets**  
❌ **Private encryption keys**  
❌ **User passwords** (Firebase handles this)  
❌ **Payment gateway keys**

---

## 📚 Additional Resources

1. **Firebase Security Documentation**:

   - [Understanding Firebase Security](https://firebase.google.com/docs/rules)
   - [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
   - [App Check](https://firebase.google.com/docs/app-check)

2. **Best Practices**:

   - [Firebase Security Best Practices](https://firebase.google.com/support/guides/security-checklist)
   - [Common Security Pitfalls](https://fireship.io/lessons/firebase-security-rules/)

3. **Testing Rules**:
   - Use Firebase Emulator Suite for local testing
   - Test rules in Firebase Console → Firestore → Rules tab → Run simulation

---

## 🎯 Quick Security Setup (5 Minutes)

1. **Enable Firestore Security Rules** (see section 1)
2. **Restrict to Email/Password only** (Authentication → Sign-in method)
3. **Add authorized domains** (Authentication → Settings → Authorized domains)
4. **Set budget alert** ($5-10/month for safety)
5. **Test with different user accounts**

---

## ✅ Your Current Security Status

Based on your current implementation:

| Security Feature        | Status          | Priority     |
| ----------------------- | --------------- | ------------ |
| Firebase Config Visible | ✅ Safe         | N/A          |
| User Authentication     | ✅ Enabled      | High         |
| Firebase Security Rules | ⚠️ Needs Update | **Critical** |
| App Check               | ❌ Not Enabled  | Medium       |
| Email Verification      | ❌ Not Enabled  | Low          |
| Budget Alerts           | ❌ Not Set      | Medium       |

### Immediate Action Required:

**Update Firestore Security Rules** ← Do this NOW!

Your test mode rules expire and allow anyone to read/write your database. Follow the instructions in Section 1 to secure your data.

---

## 💡 Summary

- ✅ Firebase API keys in client code are **SAFE and INTENDED**
- 🔒 Security comes from **Authentication + Security Rules**, not hidden keys
- 🛡️ Always set proper Firestore Security Rules
- 📊 Monitor usage to prevent abuse
- 🚀 Your app is already well-structured for security!

**Bottom Line:** Focus on Security Rules, not hiding API keys!
