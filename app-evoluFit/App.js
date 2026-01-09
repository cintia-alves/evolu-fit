import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext'; // <--- Importe aqui

import AppNavigator from './src/routes/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';

const AppContent = () => {
  const { theme } = useAppTheme();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsAppReady(true);
    }
    prepare();
  }, []);

  if (!isAppReady) {
    return <SplashScreen />;
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}> 
        <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
          <AuthProvider> 
             <AppNavigator />
          </AuthProvider>
        </SafeAreaProvider>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}