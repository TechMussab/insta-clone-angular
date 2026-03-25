# InstaClone Angular - Quick Start

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase account
- ImgBB API key (for image uploads)

### Installation

1. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

2. **Configure Firebase**
```bash
# Copy the environment template
cp src/environments/environment.template.ts src/environments/environment.ts
cp src/environments/environment.template.ts src/environments/environment.prod.ts
```

Then edit `src/environments/environment.ts` with your Firebase config from https://console.firebase.google.com

3. **Configure ImgBB API**
Edit `src/app/services/upload.service.ts` and add your ImgBB API key

4. **Run the app**
```bash
npm start
```

Visit http://localhost:4200

## 📁 Project Structure

```
src/app/
├── components/       # Reusable UI components
│   ├── navbar/
│   ├── post-item/
│   └── story-bar/
├── guards/          # Route protection
├── models/          # TypeScript interfaces
├── pages/           # Route pages
│   ├── home/
│   ├── login/
│   ├── signup/
│   ├── profile/
│   ├── search/
│   └── chat/
└── services/        # Business logic & Firebase
```

## 🔥 Firebase Setup

### 1. Enable Authentication
- Go to Firebase Console → Authentication
- Enable Email/Password sign-in method

### 2. Create Firestore Database
- Go to Firestore Database
- Create database in production mode
- Add security rules from SETUP.md

### 3. Firestore Collections
The app will automatically create these collections:
- `users` - User profiles
- `posts` - All posts
- `stories` - 24-hour stories
- `follows` - Follow relationships
- `chats` - Chat conversations
  - `messages` (subcollection)

## ✨ Features

- ✅ Authentication (signup/login/logout)
- ✅ Real-time feed
- ✅ Post creation with images
- ✅ Like/unlike posts
- ✅ Comments
- ✅ Stories (24h expiry)
- ✅ User profiles
- ✅ Search users
- ✅ Direct messaging
- ✅ Responsive design

## 🛠️ Tech Stack

- **Angular 21** - Standalone components with Signals
- **Firebase** - Auth + Firestore
- **Tailwind CSS** - Styling
- **AngularFire** - Firebase integration
- **ImgBB API** - Image hosting

## 📝 Notes

- Using `--legacy-peer-deps` due to AngularFire/Angular 21 compatibility
- All routes are lazy-loaded
- Real-time updates via Firestore snapshots
- Protected routes with AuthGuard

## 🐛 Troubleshooting

**Build errors?**
```bash
npm install --legacy-peer-deps --force
```

**Firebase not connecting?**
- Check environment.ts has correct config
- Verify Firebase project is active
- Check browser console for errors

**Tailwind not working?**
- Ensure tailwind.config.js exists
- Check styles.css has @tailwind directives
- Restart dev server

## 📚 Next Steps

See SETUP.md for:
- Detailed Firebase security rules
- Additional features to implement
- Architecture details
- Deployment guide
