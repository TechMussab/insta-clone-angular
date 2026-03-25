# InstaClone Angular

Instagram clone built with Angular 21, Firebase, and Tailwind CSS.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create a Firestore Database
4. Copy your Firebase config and update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

### 3. Configure ImgBB API (for image uploads)
1. Get an API key from https://api.imgbb.com
2. Update `src/app/services/upload.service.ts` with your API key

### 4. Firestore Security Rules
Set up these security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }

    match /follows/{followId} {
      allow read: if request.auth != null;
      allow create, delete: if request.auth != null;
    }

    match /stories/{storyId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.userId;
    }

    match /chats/{chatId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.participants;

      match /messages/{messageId} {
        allow read, create: if request.auth != null;
      }
    }
  }
}
```

### 5. Run the Application
```bash
npm start
```

Navigate to `http://localhost:4200`

## Features Implemented

- ✅ User Authentication (Sign up, Login, Logout)
- ✅ Home Feed with real-time posts
- ✅ Post creation with image upload
- ✅ Like/Unlike posts
- ✅ Comments on posts
- ✅ Stories (24-hour expiry)
- ✅ User profiles
- ✅ Search users
- ✅ Direct messaging
- ✅ Follow/Unfollow users
- ✅ Responsive design with Tailwind CSS

## Project Structure

```
src/
├── app/
│   ├── components/          # Reusable components
│   │   ├── navbar/
│   │   ├── post-item/
│   │   └── story-bar/
│   ├── guards/              # Route guards
│   │   └── auth.guard.ts
│   ├── models/              # TypeScript interfaces
│   │   ├── user.model.ts
│   │   ├── post.model.ts
│   │   ├── story.model.ts
│   │   ├── comment.model.ts
│   │   ├── message.model.ts
│   │   └── notification.model.ts
│   ├── pages/               # Page components
│   │   ├── home/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── profile/
│   │   ├── search/
│   │   └── chat/
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── post.service.ts
│   │   ├── chat.service.ts
│   │   └── upload.service.ts
│   └── app.routes.ts        # Routing configuration
└── environments/            # Environment configs
```

## Architecture Notes

- **Standalone Components**: Using Angular 21's standalone component architecture
- **Signals**: Leveraging Angular Signals for reactive state management
- **Lazy Loading**: All routes are lazy-loaded for optimal performance
- **Real-time Updates**: Firestore's `onSnapshot` for live data synchronization
- **Guard Protection**: AuthGuard protects authenticated routes

## Next Steps

To complete the implementation:

1. Add profile editing functionality
2. Implement notifications system
3. Add image compression before upload
4. Implement infinite scroll for feed
5. Add post detail view with full comments
6. Implement story creation and viewing
7. Add follow/unfollow functionality
8. Enhance search with Algolia or similar
9. Add loading states and error handling
10. Implement proper image optimization with NgOptimizedImage

## Notes

- The app uses `--legacy-peer-deps` due to AngularFire not yet supporting Angular 21
- Replace placeholder images with actual user uploads
- Update Firebase config before running
- Set up proper Firestore indexes for complex queries
