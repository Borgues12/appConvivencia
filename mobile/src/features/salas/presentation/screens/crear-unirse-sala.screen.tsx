import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CrearSalaScreen } from './crear-sala.screen';
import { UnirseSalaScreen } from './unirse-sala.screen';

export function CrearOUnirseSalaScreen() {
  const [modo, setModo] = useState<'crear' | 'unirse'>('crear');

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <Pressable onPress={() => setModo('crear')}>
          <Text style={modo === 'crear' ? styles.tabActivo : styles.tab}>Crear sala</Text>
        </Pressable>
        <Pressable onPress={() => setModo('unirse')}>
          <Text style={modo === 'unirse' ? styles.tabActivo : styles.tab}>Unirse a sala</Text>
        </Pressable>
      </View>

      {modo === 'crear' ? <CrearSalaScreen /> : <UnirseSalaScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabs: { flexDirection: 'row', justifyContent: 'center', gap: 24, paddingTop: 48 },
  tab: { fontSize: 16, color: '#999' },
  tabActivo: { fontSize: 16, fontWeight: 'bold', color: '#000' },
});