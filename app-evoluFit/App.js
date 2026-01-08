import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';

import AppNavigator from './src/routes/AppNavigator'; // Importa nossas rotas
import SplashScreen from './src/screens/SplashScreen';

const AppContent = () => {
  const { theme } = useAppTheme();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      // Simula carregamento inicial
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
      {/* O NavigationContainer deve envolver a aplicação */}
      <NavigationContainer theme={theme}> 
        <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
          <AppNavigator />
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