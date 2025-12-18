import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext'; // Importe o hook

const AuthLayout = ({ children }) => {
  const { theme } = useAppTheme(); // Pegamos o tema atual (claro ou escuro)

  return (
    // Aplicamos a cor de fundo dinamicamente aqui
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
            <Image
                source={require('../../assets/logo.png')}
                style={{ width: 100, height: 100 }}
            />
        </View>
        <Text variant="headlineLarge" style={styles.appTitle}>EvoluFit</Text>
        <Text variant="bodyMedium" style={styles.appSubtitle}>Sua evolução começa aqui</Text>
      </View>

      {/* O container branco agora muda para azul escuro no dark mode */}
      <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {children}
            </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Removemos backgroundColor fixo daqui
  container: { flex: 1 }, 
  header: {
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  logoContainer: { marginBottom: 10 },
  appTitle: { color: '#FFF', fontWeight: 'bold', letterSpacing: 1 },
  appSubtitle: { color: '#B3CDE0', marginTop: 5 },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scrollContent: { paddingBottom: 20 },
});

export default AuthLayout;