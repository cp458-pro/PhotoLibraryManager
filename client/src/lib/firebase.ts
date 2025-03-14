import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    console.error("Firebase auth error:", error);

    // Provide more specific error messages
    if (error.code === 'auth/configuration-not-found') {
      throw new Error("Firebase authentication is not properly configured. Please check your Firebase console settings.");
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error("The sign-in popup was blocked by your browser. Please allow popups for this site.");
    } else if (error.code === 'auth/popup-closed-by-user') {
      throw new Error("The sign-in popup was closed before completing the sign-in process.");
    }

    throw new Error(error.message || "Failed to sign in with Google");
  }
}