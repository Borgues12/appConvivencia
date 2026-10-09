import { Linking, PermissionsAndroid, Platform } from "react-native";
import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  requestPermission,
  hasPermission,
  subscribeToTopic,
  unsubscribeFromTopic,
  AuthorizationStatus,
  getToken,
} from "@react-native-firebase/messaging";

const esNativo = Platform.OS !== "web";

// se crea al usarla, no al importar el archivo
function getInstance() {
  return getMessaging(getApp());
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!esNativo) return false;

  // Android 13+: se pide directo al sistema, sin pasar por Firebase
  if (Platform.OS === "android" && Platform.Version >= 33) {
    const resultado = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    console.log("[notif] PermissionsAndroid resultado:", resultado);
    return resultado === PermissionsAndroid.RESULTS.GRANTED;
  }

  // iOS y Android < 13
  const estado = await requestPermission(getInstance());
  console.log("[notif] estado crudo de Firebase:", estado);
  return (
    estado === AuthorizationStatus.AUTHORIZED ||
    estado === AuthorizationStatus.PROVISIONAL
  );
}

export async function hasNotificationPermission(): Promise<boolean> {
  if (!esNativo) return false;
  const estado = await hasPermission(getInstance());
  return (
    estado === AuthorizationStatus.AUTHORIZED ||
    estado === AuthorizationStatus.PROVISIONAL
  );
}

export async function subscribeToRoomTopic(salaId: string): Promise<void> {
  if (!esNativo) return;
  await subscribeToTopic(getInstance(), `sala_${salaId}`);
  console.log("[notif] suscripción a sala_",salaId);
}

export async function unsubscribeFromRoomTopic(salaId: string): Promise<void> {
  if (!esNativo) return;
  await unsubscribeFromTopic(getInstance(), `sala_${salaId}`);
}

//FUNCION: obtiene el token del dispositivo para probar en Firebase Cloud Messaging
export async function getFcmToken(): Promise<string | null> {
  if (!esNativo) return null;
  return await getToken(getInstance());
}

//FUNCION: abre las configuraciones de notificaciones
export async function openNotificationSettings(): Promise<void> {
  if (!esNativo) return;
  await Linking.openSettings();
}