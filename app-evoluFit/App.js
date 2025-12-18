import React, { useState, useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext'; // Novo Contexto

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SuccessScreen from './src/screens/SuccessScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import SettingsScreen from './src/screens/SettingsScreen'; // Nova Tela

const AppContent = () => {
  const { theme } = useAppTheme();
  const [isAppReady, setIsAppReady] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('login');

  useEffect(() => {
    async function prepare() {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsAppReady(true);
    }
    prepare();
  }, []);

  if (!isAppReady) {
    return <SplashScreen />; // Splash agora usa estilos padrão ou precisa ser atualizada se quiser tema
  }

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider style={{ backgroundColor: theme.colors.background }}>
        
        {currentScreen === 'login' && (
          <LoginScreen 
            onNavigateToRegister={() => setCurrentScreen('register')} 
            onLoginSuccess={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'register' && (
          <RegisterScreen 
            onNavigateToLogin={() => setCurrentScreen('login')} 
            onRegisterSuccess={() => setCurrentScreen('success')} 
          />
        )}

        {currentScreen === 'success' && (
          <SuccessScreen onStart={() => setCurrentScreen('dashboard')} />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardScreen onNavigateToSettings={() => setCurrentScreen('settings')} />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen 
            onBack={() => setCurrentScreen('dashboard')}
            onLogout={() => setCurrentScreen('login')}
          />
        )}

      </SafeAreaProvider>
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