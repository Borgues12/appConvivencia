import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../../../auth/presentation/store/use-auth-store';
import { useSalaStore } from '../store/use-sala-store';

export function UnirseSalaScreen() {
  const [codigo, setCodigo] = useState('');
  const user = useAuthStore((state) => state.user);
  const { unirse, isLoading, error, sala } = useSalaStore();

  const handleUnirse = () => {
    if (!user || codigo.trim().length !== 6) return;
    unirse(codigo.trim().toUpperCase(), user.uid);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Unirse a Sala</Text>

      <TextInput
        style={styles.input}
        placeholder="Código de invitación"
        value={codigo}
        onChangeText={setCodigo}
        autoCapitalize="characters"
        maxLength={6}
      />

      <Button title="Unirse" onPress={handleUnirse} disabled={isLoading} />

      {isLoading && <ActivityIndicator />}
      {error && <Text style={styles.error}>{error}</Text>}
      {sala && <Text style={styles.exito}>Te uniste a: {sala.salaNombre}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  error: { color: 'red', marginTop: 8 },
  exito: { marginTop: 16, fontSize: 16, fontWeight: '600', color: 'green' },
});