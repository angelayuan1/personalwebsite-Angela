# personalwebsite-Angela

Personal portfolio website with Firebase integration.

## Setup

### Firebase Configuration

To connect your website to Firebase and display data from your "pandas" collection:

1. **Get your Firebase configuration:**
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps" section
   - Click "Add app" if you haven't already, or click on your existing web app
   - Copy the configuration object

2. **Update the Firebase config in `public/index.html`:**
   - Open `public/index.html`
   - Find the Firebase configuration section (around line 22-29)
   - Replace the placeholder values with your actual Firebase config:
     ```javascript
     const firebaseConfig = {
       apiKey: "your-actual-api-key",
       authDomain: "your-project-id.firebaseapp.com",
       projectId: "your-project-id",
       storageBucket: "your-project-id.appspot.com",
       messagingSenderId: "your-actual-messaging-sender-id",
       appId: "your-actual-app-id"
     };
     ```

3. **Set up Firestore security rules:**
   - The current `firestore.rules` file allows read/write access until December 11, 2025
   - For production, update the rules in `firestore.rules` to match your security requirements

4. **Add data to your "pandas" collection:**
   - Go to Firestore Database in your Firebase Console
   - Create a collection called "pandas"
   - Add documents with any fields you want to display

## Features

- **Home**: Welcome page
- **Projects**: Interactive projects including Cauchy-Schwarz Inequality Simulator
- **Pandas**: Displays data from your Firebase Firestore "pandas" collection
- **About**: Personal information

## Deployment

Deploy to Firebase Hosting:

```bash
firebase deploy
```

## Development

To run locally:

```bash
firebase serve
```
