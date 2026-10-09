// features/salas/presentation/screens/home.screen.tsx
import { View, Text, Button, ActivityIndicator } from "react-native";
import { signOutUser } from "../../../auth/data/auth.repository";
import { useHomeScreen } from "../hooks/useHomeScreen";
import { SafeAreaView } from "react-native-safe-area-context";

import { styles } from "./styles/home.styles";
import { SalaInfoCard } from "../components/salaInfoCard";
import { SesionEstadoPanel } from "../components/sesionEstadoPanel";
import { ConfigHoraForm } from "../components/configHoraForm";
import { CancelarSesionForm } from "../components/cancelarSesionForm";
import { useCheckinPin } from "../../../sesiones/presentation/hooks/useCheckIn";
import { useAuthStore } from "../../../auth/presentation/store/use-auth-store";
import { TableroPin } from "../../../sesiones/presentation/components/TableroPin";

export function HomeScreen() {
  
  const vm = useHomeScreen();
  const usuario = useAuthStore((state) => state.usuario);
  const checkin = useCheckinPin(vm.sesionActual?.sesionId, usuario?.userUid);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>
        Bienvenido, {vm.usuario?.userDisplayName}
      </Text>

      {vm.cargandoSala ? (
        <ActivityIndicator />
      ) : vm.sala ? (
        <View style={styles.salaInfo}>
          <SalaInfoCard
            salaNombre={vm.sala.salaNombre}
            salaCodigoInvitacion={vm.sala.salaCodigoInvitacion}
          />

          <SesionEstadoPanel
            sesionActual={vm.sesionActual}
            sesionCargando={vm.sesionCargando}
            usuarioUid={vm.usuario?.userUid}
            handleIniciarSesion={vm.handleIniciarSesion}
          />

          {vm.sesionActual?.sesionEstado === "en_curso" && (
            <TableroPin
              pin={checkin.pin}
              longitud={checkin.longitudPin}
              errorPin={checkin.errorPin}
              yaHiceCheckin={checkin.yaHiceCheckin}
              puedeEnviarPin={checkin.puedeEnviarPin}
              onChangePin={checkin.handleChangePin}
              onSubmit={checkin.handleSubmitPin}
              mostrandoModalMotivo={checkin.mostrandoModalMotivo}
              motivo={checkin.motivo}
              puedeEnviarMotivo={checkin.puedeEnviarMotivo}
              onChangeMotivo={checkin.setMotivo}
              onConfirmMotivo={checkin.handleConfirmMotivo}
              onCancelMotivo={checkin.handleCancelMotivo}
            />
          )}

          <ConfigHoraForm
            esAdmin={vm.esAdmin}
            salaHoraInicio={vm.sala.salaHoraInicio}
            mostrandoConfigHora={vm.mostrandoConfigHora}
            setMostrandoConfigHora={vm.setMostrandoConfigHora}
            horaInicioInput={vm.horaInicioInput}
            setHoraInicioInput={vm.setHoraInicioInput}
            guardandoHora={vm.guardandoHora}
            errorHora={vm.errorHora}
            sesionEstado={vm.sesionActual}
            handleGuardarHora={vm.handleGuardarHora}
          />

          <CancelarSesionForm
            sePuedeCancelar={vm.sePuedeCancelar}
            mostrandoInputCancelar={vm.mostrandoInputCancelar}
            setMostrandoInputCancelar={vm.setMostrandoInputCancelar}
            motivoCancelacion={vm.motivoCancelacion}
            setMotivoCancelacion={vm.setMotivoCancelacion}
            cancelandoSesion={vm.cancelandoSesion}
            handleCancelarSesion={vm.handleCancelarSesion}
          />

          <Button
            title={vm.saliendoDeSala ? "Saliendo..." : "Salir de la sala"}
            onPress={vm.handleSalirDeSala}
            disabled={vm.saliendoDeSala}
          />
        </View>
      ) : (
        <Text>No perteneces a ninguna sala aún</Text>
      )}

      <Button title="Cerrar sesión" onPress={signOutUser} />
    </SafeAreaView>
  );
}
