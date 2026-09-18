import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// @ts-expect-error - getReactNativePersistence existe en runtime (@firebase/auth rn build) pero falta en los tipos publicados del paquete "firebase". Ver: https://github.com/firebase/firebase-js-sdk/issues/9316
import { initializeAuth, getReactNativePersistence, indexedDBLocalPersistence, Auth, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
let authInstance: Auth;

try {
  authInstance = initializeAuth(firebaseApp, {
    persistence: Platform.OS === 'web'
      ? indexedDBLocalPersistence
      : getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // Si ya fue inicializada durante un Hot Reload o en Web
  authInstance = getAuth(firebaseApp);
}

export const auth = authInstance;
export const db = getFirestore(firebaseApp);