# Convivencia Audiovisual — Módulo Auth (Sala)

## ◆ Resumen de la Integración

### Qué se logró

	▸ Login con Google Sign-In nativo funcionando de punta a punta en development build
	▸ Firebase Auth conectado, sesión persistente entre reinicios de la app
	▸ Proyecto Firebase limpio: coexistence-c36b5, package com.borgues.mobile
	▸ Repository Pattern aplicado: solo auth-repository.ts habla con Firebase Auth

### Decisión técnica clave

	▸ Se descartó expo-auth-session (flujo de navegador) por incompatibilidad real: los OAuth Client de tipo Android no soportan flujos de redirect en navegador, solo el SDK nativo
	▸ Se migró a @react-native-google-signin/google-signin, selector nativo de cuentas, estable para Android nativo

## ◆ Piezas Configuradas

### Firebase

	▸ Authentication con proveedor Google habilitado
	▸ Firestore Database creado en modo producción, sin colecciones pobladas aún
	▸ App Android registrada con package com.borgues.mobile y SHA-1 del keystore Coexistence (EAS)
	▸ google-services.json descargado y ubicado en mobile/

### Código

	▸ src/shared/services/firebase.ts — inicialización de Firebase (auth, db)
	▸ src/features/salas/data/auth-repository.ts — signInWithGoogle, signOutUser, subscribeToAuthChanges
	▸ src/features/salas/presentation/store/useAuthStore.ts — estado de sesión en Zustand
	▸ src/features/salas/presentation/screens/LoginScreen.tsx — pantalla con botón de Google
	▸ App.tsx — enrutamiento básico entre LoginScreen y estado logueado

### Build

	▸ Development build vía EAS, no funciona en Expo Go por módulos nativos (Firebase, Google Sign-In)
	▸ Cada dependencia nativa nueva exige nuevo build antes de poder probarse en dispositivo

## ◆ Lecciones Técnicas

	▸ getReactNativePersistence existe en runtime pero no en los tipos publicados del paquete firebase (bug conocido upstream), se silenció con @ts-expect-error puntual
	▸ Firebase JS SDK requiere expo-application y expo-constants como módulos nativos para detección de entorno en React Native
	▸ El SHA-1 debe coincidir exacto con el keystore que EAS usa como default (eas credentials para verificar)
	▸ SHA-256 no reemplaza al SHA-1 para Google Sign-In, son propósitos distintos