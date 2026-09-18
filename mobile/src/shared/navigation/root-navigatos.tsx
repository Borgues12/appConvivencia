import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../../features/auth/presentation/store/use-auth-store";
import { LoginScreen } from "../../features/auth/presentation/screens/login.screen";

import { CrearOUnirseSalaScreen } from "../../features/salas/presentation/screens/crear-unirse-sala.screen";
import { HomeScreen } from "../../features/salas/presentation/screens/home.screen";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const user = useAuthStore((state) => state.user);
  const userSalaActualId = useAuthStore(
    (state) => state.usuario?.userSalaActualId,
  );
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : !userSalaActualId ? (
          <Stack.Screen
            name="CrearOUnirseSala"
            component={CrearOUnirseSalaScreen}
          />
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
