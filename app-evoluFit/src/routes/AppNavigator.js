import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SuccessScreen from '../screens/SuccessScreen';
import DashboardScreen from '../screens/DashboardScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CreateRotinaNameScreen from '../screens/CreateRotinaNameScreen';
import RotinaDetailScreen from '../screens/RotinaDetailScreen';
import RotinasScreen from '../screens/RotinasScreen';
import SelectExercisesScreen from '../screens/SelectExercisesScreen';
import ExecucaoTreinoScreen from '../screens/ExecucaoTreinoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />

      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      
      <Stack.Screen name="CreateRotinaName" component={CreateRotinaNameScreen} />
      <Stack.Screen name="RotinaDetail" component={RotinaDetailScreen} />

      <Stack.Screen name="Rotinas" component={RotinasScreen} />

      <Stack.Screen name="SelectExercises" component={SelectExercisesScreen} />

      <Stack.Screen name="ExecucaoTreino" component={ExecucaoTreinoScreen} />
    </Stack.Navigator>
  );
}