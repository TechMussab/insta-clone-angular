# 🚀 InstaClone Angular - Setup Checklist

Use this checklist to get your InstaClone app up and running.

## ✅ Prerequisites

- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Firebase account created
- [ ] ImgBB account created (for image uploads)

## 📦 Installation

- [ ] Clone/download the repository
- [ ] Run `npm install --legacy-peer-deps`
- [ ] Verify no installation errors

## 🔥 Firebase Configuration

### Create Firebase Project
- [ ] Go to https://console.firebase.google.com
- [ ] Click "Add project"
- [ ] Name your project (e.g., "instaclone-angular")
- [ ] Disable Google Analytics (optional)
- [ ] Create project

### Enable Authentication
- [ ] Go to Authentication → Get Started
- [ ] Click "Email/Password"
- [ ] Enable "Email/Password" provider
- [ ] Save

### Create Firestore Database
- [ ] Go to Firestore Database
- [ ] Click "Create database"
- [ ] Choose "Start in production mode"
- [ ] Select a location (closest to your users)
- [ ] Click "Enable"

### Get Firebase Config
- [ ] Go to Project Settings (gear icon)
- [ ] Scroll to "Your apps"
- [ ] Click web icon (</>)
- [ ] Register app (name: "InstaClone Angular")
- [ ] Copy the firebaseConfig object

### Update Environment Files
- [ ] Copy `src/environments/environment.template.ts` to `src/environments/environment.ts`
- [ ] Paste your Firebase config into `environment.ts`
- [ ] Copy to `src/environments/environment.prod.ts` as well

### Set Firestore Security Rules
- [ ] Go to Firestore Database → Rules
- [ ] Copy rules from SETUP.md
- [ ] Publish rules

## 🖼️ ImgBB Configuration

- [ ] Go to https://api.imgbb.com/
- [ ] Sign up / Log in
- [ ] Get your API key
- [ ] Open `src/app/services/upload.service.ts`
- [ ] Replace `YOUR_IMGBB_API_KEY` with your actual key

## 🧪 Test the Application

- [ ] Run `npm start`
- [ ] Open http://localhost:4200
- [ ] App loads without errors
- [ ] Sign up with a test account
- [ ] Verify user created in Firebase Auth
- [ ] Verify user document created in Firestore
- [ ] Log out and log back in
- [ ] Test navigation between pages

## 🎨 Verify Features

### Authentication
- [ ] Sign up creates user
- [ ] Login works
- [ ] Logout redirects to login
- [ ] Protected routes redirect when not logged in

### Home Feed
- [ ] Home page loads
- [ ] Story bar displays (empty initially)
- [ ] Feed shows "No posts yet" message
- [ ] Navbar displays correctly

### Profile
- [ ] Can navigate to profile
- [ ] Profile shows user info
- [ ] Post grid displays (empty initially)

### Search
- [ ] Search page loads
- [ ] Search input displays

### Chat
- [ ] Chat page loads
- [ ] Message list displays (empty initially)

## 🐛 Troubleshooting

### Build Errors
- [ ] Try `npm install --legacy-peer-deps --force`
- [ ] Clear node_modules: `rm -rf node_modules && npm install --legacy-peer-deps`
- [ ] Check Node version: `node -v` (should be 18+)

### Firebase Connection Issues
- [ ] Verify environment.ts has correct config
- [ ] Check Firebase project is active
- [ ] Open browser console for errors
- [ ] Verify Firestore rules are published

### Tailwind Not Working
- [ ] Check `tailwind.config.js` exists
- [ ] Verify `src/styles.css` has @tailwind directives
- [ ] Restart dev server

### Authentication Errors
- [ ] Verify Email/Password is enabled in Firebase
- [ ] Check browser console for specific errors
- [ ] Try with a different email

## 📝 Next Steps After Setup

### Create Test Data
- [ ] Create 2-3 test user accounts
- [ ] Add follow relationships in Firestore manually
- [ ] Create test posts in Firestore
- [ ] Test the feed with real data

### Implement Missing Features
- [ ] Add profile editing
- [ ] Implement follow/unfollow
- [ ] Add story creation
- [ ] Build notifications

### Optimize
- [ ] Add loading states
- [ ] Implement error handling
- [ ] Add image compression
- [ ] Set up pagination

## 🎓 Learning Resources

- [ ] Read IMPLEMENTATION.md for architecture details
- [ ] Review Angular Signals documentation
- [ ] Study AngularFire examples
- [ ] Explore Firestore query patterns

## ✨ You're Ready!

Once all checkboxes are complete, your InstaClone Angular app is fully configured and ready for development!

**Need help?** Check the documentation:
- README.md - Overview
- QUICKSTART.md - Fast setup
- SETUP.md - Detailed configuration
- IMPLEMENTATION.md - Technical details

---

**Last Updated:** 2026-03-25
**Version:** 1.0.0
