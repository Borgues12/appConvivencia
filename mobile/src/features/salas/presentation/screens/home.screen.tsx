import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../../auth/presentation/store/use-auth-store";
import { signOutUser } from "../../../auth/data/auth.repository";
import { useEffect, useState } from "react";
import { Sala } from "../../domain/sala.schema";
import { getRoomById, leaveRoom } from "../../data/salas.repository";
import { useAlertaStore } from "../../../../shared/alertas/store/use-alerta.store";
import { useSesionStore } from "../../../sesiones/presentation/store/sesion.store";
import { colores } from "../../../../core/theme/tema";

export function HomeScreen() {
  const usuario = useAuthStore((state) => state.usuario);
  const actualizarUsuario = useAuthStore((state) => state.actualizarUsuario);
  const [sala, setSala] = useState<Sala | null>(null);
  const [cargandoSala, setCargandoSala] = useState(true);
  const [saliendoDeSala, setSaliendoDeSala] = useState(false);

  // estado local solo para el flujo de cancelación del admin
  const [mostrandoInputCancelar, setMostrandoInputCancelar] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [cancelandoSesion, setCancelandoSesion] = useState(false);

  const {
    sesionActual,
    sesionCargando,
    iniciarSesion,
    suscribirseASesionDeHoy,
    cancelarSesionPorAdmin,
  } = useSesionStore();

  useEffect(() => {
    if (!usuario?.userSalaActualId) {
      setCargandoSala(false);
      return;
    }
    getRoomById(usuario.userSalaActualId)
      .then(setSala)
      .finally(() => setCargandoSala(false));
  }, [usuario?.userSalaActualId]);

  // suscripción en tiempo real a la sesión de hoy, se limpia al salir de la pantalla
  // o si cambia la sala activa
  useEffect(() => {
    if (!usuario?.userSalaActualId) return;
    const unsubscribe = suscribirseASesionDeHoy(usuario.userSalaActualId);
    return unsubscribe;
  }, [usuario?.userSalaActualId]);

  const handleSalirDeSala = async () => {
    if (!usuario?.userSalaActualId) return;
    setSaliendoDeSala(true);
    try {
      await leaveRoom(usuario.userSalaActualId, usuario.userUid);
      actualizarUsuario({ userSalaActualId: null });
      setSala(null);
    } catch (err) {
      const mensaje =
        err instanceof Error ? err.message : "No se pudo salir de la sala";
      useAlertaStore.getState().mostrarAlerta({
        tipo: "error",
        mensaje: "No se pudo salir de la sala",
      });
    } finally {
      setSaliendoDeSala(false);
    }
  };

  // inicio de sesión en la sala actual
  const handleIniciarSesion = async () => {
    if (!usuario?.userSalaActualId) return;
    await iniciarSesion(usuario.userSalaActualId, usuario.userUid);
    const error = useSesionStore.getState().sesionError;
    if (error) {
      useAlertaStore
        .getState()
        .mostrarAlerta({ tipo: "error", mensaje: error });
    }
  };

  const handleCancelarSesion = async () => {
    if (!sesionActual || !usuario) return;

    if (motivoCancelacion.trim().length === 0) {
      useAlertaStore.getState().mostrarAlerta({
        tipo: "advertencia",
        mensaje: "Escribe un motivo para cancelar",
      });
      return;
    }

    setCancelandoSesion(true);
    try {
      // Invocación a través del store
      await cancelarSesionPorAdmin(
        sesionActual.sesionId,
        usuario.userUid,
        motivoCancelacion.trim(),
      );

      setMostrandoInputCancelar(false);
      setMotivoCancelacion("");
    } catch (err) {
      useAlertaStore.getState().mostrarAlerta({
        tipo: "error",
        mensaje: "No se pudo cancelar la sesión",
      });
    } finally {
      setCancelandoSesion(false);
    }
  };

  const esAdmin = usuario && sala && usuario.userUid === sala.salaAdminUid;
  const sePuedeCancelar =
    esAdmin &&
    (sesionActual?.sesionEstado === "pendiente" ||
      sesionActual?.sesionEstado === "en_curso");

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bienvenido, {usuario?.userDisplayName}</Text>

      {cargandoSala ? (
        <ActivityIndicator />
      ) : sala ? (
        <View style={styles.salaInfo}>
          <Text>Sala actual: {sala.salaNombre}</Text>
          <Text style={styles.codigoLabel}>Código de invitación</Text>
          <Text style={styles.codigo}>{sala.salaCodigoInvitacion}</Text>
          {/* bloque de Sesión: solo mostrar acción si hay algo pendiente que hacer */}
          {sesionActual?.sesionEstado === "pendiente" && (
            <TouchableOpacity
              style={styles.botonSesion}
              onPress={handleIniciarSesion}
              disabled={sesionCargando}
            >
              <Ionicons
                name="play-circle"
                size={22}
                color={colores.textoSobreFondo}
              />
              <Text style={styles.botonSesionTexto}>
                {sesionCargando ? "Iniciando..." : "Iniciar Sesión"}
              </Text>
            </TouchableOpacity>
          )}

          {sesionActual?.sesionEstado === "en_curso" && (
            <View style={styles.sesionInfoContainer}>
              {/* CASO A: El usuario actual fue quien inició la sesión -> Muestra el PIN */}
              {usuario?.userUid === sesionActual.sesionIniciadaPorUid ? (
                <View style={styles.pinContenedor}>
                  <Ionicons name="key" size={20} color={colores.fondo} />
                  <Text style={styles.pinLabel}>PIN de la sesión:</Text>
                  <Text style={styles.pinValor}>{sesionActual.sesionPin}</Text>
                </View>
              ) : (
                /* CASO B: Miembro secundario -> Debe ingresar el PIN */
                <View style={styles.sesionInfo}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colores.exito}
                  />
                  <Text style={styles.sesionInfoTexto}>
                    Check-in abierto, ingresa el PIN
                  </Text>
                </View>
              )}
            </View>
          )}

          {sesionActual?.sesionEstado === "cancelada" && (
            <View style={styles.sesionInfo}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colores.acentoSecundario}
              />
              <Text style={styles.sesionInfoTexto}>
                Sesión cancelada por el admin
              </Text>
            </View>
          )}

          {/* Cancelar sesión: solo visible para el admin, solo si hay algo que cancelar */}
          {sePuedeCancelar && !mostrandoInputCancelar && (
            <TouchableOpacity
              style={styles.botonCancelar}
              onPress={() => setMostrandoInputCancelar(true)}
            >
              <Ionicons name="ban" size={20} color={colores.acentoSecundario} />
              <Text style={styles.botonCancelarTexto}>
                Cancelar sesión de hoy
              </Text>
            </TouchableOpacity>
          )}

          {sePuedeCancelar && mostrandoInputCancelar && (
            <View style={styles.formCancelar}>
              <TextInput
                style={styles.inputMotivo}
                placeholder="Motivo de la cancelación"
                value={motivoCancelacion}
                onChangeText={setMotivoCancelacion}
                multiline
              />
              <View style={styles.filaBotonesCancelar}>
                <Button
                  title={cancelandoSesion ? "Cancelando..." : "Confirmar"}
                  onPress={handleCancelarSesion}
                  disabled={cancelandoSesion}
                />
                <Button
                  title="Volver"
                  onPress={() => {
                    setMostrandoInputCancelar(false);
                    setMotivoCancelacion("");
                  }}
                  disabled={cancelandoSesion}
                />
              </View>
            </View>
          )}

          <Button
            title={saliendoDeSala ? "Saliendo..." : "Salir de la sala"}
            onPress={handleSalirDeSala}
            disabled={saliendoDeSala}
          />
        </View>
      ) : (
        <Text>No perteneces a ninguna sala aún</Text>
      )}

      <Button title="Cerrar sesión" onPress={signOutUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  salaInfo: { alignItems: "center", gap: 4 },
  codigoLabel: { fontSize: 12, color: "#999", marginTop: 8 },
  codigo: { fontSize: 28, fontWeight: "700", letterSpacing: 4 },
  botonSesion: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colores.acentoPrimario,
    borderRadius: 2,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  botonSesionTexto: {
    color: colores.textoSobreFondo,
    fontWeight: "600",
  },
  sesionInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 12,
  },
  sesionInfoTexto: {
    color: colores.textoSobreClaro,
  },

  botonCancelar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  botonCancelarTexto: {
    color: colores.acentoSecundario,
  },
  formCancelar: {
    marginTop: 8,
    gap: 8,
  },
  inputMotivo: {
    borderWidth: 1,
    borderColor: colores.bordeSutil,
    borderRadius: 2,
    padding: 8,
    minHeight: 60,
  },
  filaBotonesCancelar: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  // Vista del PIN para quien inició la sesión
  pinContenedor: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: colores.acentoPrimario,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colores.acentoPrimario,
  },
  pinLabel: {
    fontSize: 12,
    color: colores.textoSobreFondo,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginVertical: 4,
  },
  pinValor: {
    fontSize: 28,
    fontWeight: "bold",
    color: colores.textoSobreClaro,
    letterSpacing: 6,
  },
  sesionInfoContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: colores.textoSobreFondo,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colores.textoSobreFondo,
  },

});
