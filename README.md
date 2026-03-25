# InstaClone Angular 📸

A full-featured Instagram clone built with Angular 21, Firebase, and Tailwind CSS.

## 🎯 Overview

This project is a complete recreation of Instagram's core features using modern Angular with standalone components, Firebase for backend services, and Tailwind CSS for styling. It mirrors the Android implementation described in the technical handover document.

## ✨ Features

- 🔐 **Authentication** - Email/password signup and login
- 📱 **Home Feed** - Real-time posts from followed users
- ❤️ **Interactions** - Like and comment on posts
- 📖 **Stories** - 24-hour ephemeral content
- 👤 **User Profiles** - Profile pages with post grids
- 🔍 **Search** - Find users by username
- 💬 **Direct Messaging** - Real-time chat
- 📸 **Image Upload** - Post photos via ImgBB API
- 🎨 **Responsive Design** - Mobile-first Instagram-like UI

## 🚀 Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Configure Firebase
cp src/environments/environment.template.ts src/environments/environment.ts
# Edit environment.ts with your Firebase config

# Run the app
npm start
```

Visit http://localhost:4200

📖 **Detailed instructions:** See [QUICKSTART.md](QUICKSTART.md)

## 📁 Project Structure

```
src/app/
├── components/          # Reusable UI components
│   ├── navbar/         # Navigation bar
│   ├── post-item/      # Individual post display
│   └── story-bar/      # Stories carousel
├── guards/             # Route protection
│   └── auth.guard.ts   # Authentication guard
├── models/             # TypeScript interfaces
│   ├── user.model.ts
│   ├── post.model.ts
│   ├── story.model.ts
│   └── ...
├── pages/              # Route components
│   ├── home/          # Feed page
│   ├── login/         # Login page
│   ├── signup/        # Registration page
│   ├── profile/       # User profile
│   ├── search/        # User search
│   └── chat/          # Messaging
├── services/           # Business logic
│   ├── auth.service.ts    # Authentication
│   ├── post.service.ts    # Posts & feed
│   ├── chat.service.ts    # Messaging
│   └── upload.service.ts  # Image uploads
└── app.routes.ts       # Routing configuration
```

**Total:** 29 TypeScript files, ~350 lines of code

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Angular 21** | Frontend framework with standalone components |
| **Firebase Auth** | User authentication |
| **Cloud Firestore** | Real-time NoSQL database |
| **AngularFire** | Firebase integration for Angular |
| **Tailwind CSS** | Utility-first CSS framework |
| **ImgBB API** | Image hosting service |
| **Angular Signals** | Reactive state management |
| **RxJS** | Reactive programming |

## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Copy your config to `src/environments/environment.ts`

### 2. Enable Services
- **Authentication:** Enable Email/Password provider
- **Firestore:** Create database in production mode
- **Security Rules:** Copy from [SETUP.md](SETUP.md)

### 3. Database Collections
```
users/          - User profiles
posts/          - All posts
  └─ comments/  - Post comments (subcollection)
stories/        - 24-hour stories
follows/        - Follow relationships
chats/          - Chat conversations
  └─ messages/  - Chat messages (subcollection)
```

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Fast setup guide
- **[SETUP.md](SETUP.md)** - Detailed configuration & Firebase rules
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Complete implementation details

## 🎨 Architecture

### State Management
- **Angular Signals** for reactive UI state
- **RxJS BehaviorSubject** for service state
- **Firestore onSnapshot** for real-time updates

### Component Strategy
- **Standalone components** (no NgModules)
- **Lazy-loaded routes** for performance
- **Smart/Dumb component pattern**

### Data Flow
```
User Action → Service → Firestore → onSnapshot → Signal → UI Update
```

## 🔒 Security

- Routes protected with `authGuard`
- Firestore security rules enforce data access
- Client-side validation on forms
- Environment variables for API keys

## 🚧 Known Limitations

1. Requires `--legacy-peer-deps` (AngularFire + Angular 21)
2. Firestore 'in' query limited to 10 followed users
3. No image compression before upload
4. Client-side search only (no full-text search)
5. Stories don't auto-delete (needs Cloud Function)

## 🎯 Next Steps

### High Priority
- [ ] Profile editing functionality
- [ ] Follow/unfollow users
- [ ] Story creation and viewing
- [ ] Notifications system

### Medium Priority
- [ ] Image compression
- [ ] Infinite scroll pagination
- [ ] Post detail view with full comments
- [ ] Loading states and error handling

### Nice to Have
- [ ] Algolia search integration
- [ ] Video support
- [ ] Hashtags
- [ ] Explore page
- [ ] Dark mode

## 📄 License

MIT License - feel free to use this project for learning purposes.

## 🙏 Acknowledgments

- Based on Android InstaClone technical handover
- Inspired by Instagram's UI/UX
- Built with Angular 21 and Firebase

---

**Created:** March 25, 2026
**Status:** ✅ Core features implemented, ready for Firebase configuration
**Angular Version:** 21.2.0
**Node Version:** 18+
