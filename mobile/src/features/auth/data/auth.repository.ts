import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  User,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../shared/services/firebase";
import { Platform } from "react-native";

// Carga condicional del paquete nativo ÚNICAMENTE fuera de la Web
let GoogleSignin: any = null;
let isSuccessResponse: any = null;

if (Platform.OS !== "web") {
  const googleModule = require("@react-native-google-signin/google-signin");
  GoogleSignin = googleModule.GoogleSignin;
  isSuccessResponse = googleModule.isSuccessResponse;

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });
}

// METODO: Iniciar sesión con Google
export async function signInWithGoogle(): Promise<User> {
  if (Platform.OS === "web") {
    const provider = new GoogleAuthProvider();
    // Opción A: Probar con Redirección directa en lugar de Popup
    const result = await signInWithPopup(auth, provider);
    return result.user;
  }

  // Flujo Nativo (Android / iOS)
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();

  if (!isSuccessResponse(response)) {
    throw new Error("Inicio de sesión cancelado");
  }

  const idToken = response.data?.idToken ?? (response as any).idToken;
  if (!idToken) {
    throw new Error("No se recibió idToken de Google");
  }

  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(auth, credential);
  return result.user;
}

// METODO: Cerrar sesión
export async function signOutUser(): Promise<void> {
  if (Platform.OS !== "web" && GoogleSignin) {
    await GoogleSignin.signOut();
  }
  await signOut(auth);
}

//METODO: Iniciar sesión con correo electrónico y contraseña (developer)
export async function signInWithEmailPassword(
  email: string,
  password: string
): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

// METODO: Escuchar cambios en la sesión
export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
