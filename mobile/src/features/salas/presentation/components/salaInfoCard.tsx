// features/salas/presentation/components/SalaInfoCard/SalaInfoCard.tsx
import { View, Text } from "react-native";
import { styles } from "../styles/salaInfoCard.styles";

type SalaInfoCardProps = {
  salaNombre: string;
  salaCodigoInvitacion: string;
};

export function SalaInfoCard({ salaNombre, salaCodigoInvitacion }: SalaInfoCardProps) {
  return (
    <View style={styles.contenedor}>
      <Text>Sala actual: {salaNombre}</Text>
      <Text style={styles.codigoLabel}>Código de invitación</Text>
      <Text style={styles.codigo}>{salaCodigoInvitacion}</Text>
    </View>
  );
}