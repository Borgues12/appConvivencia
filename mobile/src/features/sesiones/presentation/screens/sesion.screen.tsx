// features/sesiones/presentation/SesionScreen.tsx

import { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '../../../auth/presentation/store/use-auth-store';
import { useSalaStore } from '../../../salas/presentation/store/use-sala-store';
import { useSesionStore } from '../store/sesion.store';


export function SesionScreen() {
  const { sesionActual, sesionCargando, sesionError, iniciarSesion, suscribirseASesionDeHoy } =
    useSesionStore();

  const userUid = useAuthStore((state) => state.user?.uid);
  const salaId = useSalaStore((state) => state.sala?.salaId);

  useEffect(() => {
    if (!salaId) return;
    const unsubscribe = suscribirseASesionDeHoy(salaId);
    return unsubscribe;
  }, [salaId]);

  if (!salaId || !userUid) {
    return (
      <View style={styles.container}>
        <Text>Cargando datos de sala...</Text>
      </View>
    );
  }

  const puedeIniciar = !sesionActual || sesionActual.sesionEstado === 'pendiente';
  const esQuienInicio = sesionActual?.sesionIniciadaPorUid === userUid;

  return (
    <View style={styles.container}>
      {puedeIniciar && (
        <TouchableOpacity
          style={styles.boton}
          onPress={() => iniciarSesion(salaId, userUid)}
          disabled={sesionCargando}
        >
          {sesionCargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botonTexto}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>
      )}

      {sesionActual?.sesionEstado === 'en_curso' && esQuienInicio && (
        <View style={styles.pinContainer}>
          <Text style={styles.pinLabel}>PIN de la sesión</Text>
          <Text style={styles.pin}>{sesionActual.sesionPin}</Text>
        </View>
      )}

      {sesionActual?.sesionEstado === 'en_curso' && !esQuienInicio && (
        <Text style={styles.estadoTexto}>La sesión ya está en curso</Text>
      )}

      {sesionError && <Text style={styles.errorTexto}>{sesionError}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  boton: { backgroundColor: '#8B0000', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8 },
  botonTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
  pinContainer: { alignItems: 'center' },
  pinLabel: { fontSize: 14, color: '#888', marginBottom: 8 },
  pin: { fontSize: 48, fontWeight: '700', letterSpacing: 8 },
  estadoTexto: { fontSize: 16, color: '#555' },
  errorTexto: { color: 'red', marginTop: 12 },
});