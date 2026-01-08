// src/screens/SettingsScreen.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Avatar, Switch, IconButton, Button } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';

const SettingsItem = ({ label, icon, isSwitch, value, onToggle, onPress, theme }) => (
  <TouchableOpacity 
    style={[styles.item, { backgroundColor: theme.colors.surfaceVariant }]} 
    onPress={isSwitch ? onToggle : onPress}
    disabled={isSwitch}
  >
    <Text style={[styles.itemLabel, { color: theme.dark ? '#FFF' : '#333' }]}>{label}</Text>
    {isSwitch ? (
      <Switch value={value} onValueChange={onToggle} color={theme.colors.primary} />
    ) : (
      <IconButton icon="arrow-right" size={20} iconColor={theme.colors.secondaryText} />
    )}
  </TouchableOpacity>
);

const SettingsScreen = ({ navigation }) => {
  const { isDark, toggleTheme, theme } = useAppTheme();

  const handleLogout = () => {
      navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
      });
  };

  return (
    <View style={[styles.container, { backgroundColor: '#103B66' }]}> 
      {/* Header Fixo Azul Escuro (Branding) */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" iconColor="#FFF" size={28} onPress={() => navigation.goBack()} />
        <View style={styles.profileContainer}>
          <Avatar.Icon size={100} icon="account" style={{ backgroundColor: '#00C2FF' }} />
          <Text variant="headlineMedium" style={styles.name}>Cíntia</Text>
        </View>
      </View>

      {/* Container Branco/Escuro Arredondado */}
      <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <SettingsItem label="Editar Perfil" theme={theme} onPress={() => {}} />
          <SettingsItem label="Alterar Senha" theme={theme} onPress={() => {}} />
          
          <SettingsItem 
            label="Notificação" 
            isSwitch 
            value={true} 
            onToggle={toggleTheme} 
            theme={theme} 
          />
          
          <SettingsItem 
            label="Modo escuro" 
            isSwitch 
            value={isDark} 
            onToggle={toggleTheme} 
            theme={theme} 
          />

          <SettingsItem label="Excluir Conta" theme={theme} onPress={() => {}} />

          <Button 
            mode="contained" 
            onPress={handleLogout}
            style={styles.logoutButton}
            buttonColor="#103B66"
            textColor="#FFF"
            contentStyle={{ height: 50 }}
          >
            Sair da conta
          </Button>

        </ScrollView>
        
        {/* Simulação do Menu Inferior (apenas visual aqui para manter consistência) */}
        <View style={{ height: 60 }} /> 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 250,
    paddingTop: 40,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  profileContainer: { alignItems: 'center', marginTop: 10 },
  name: { color: '#FFF', fontWeight: 'bold', marginTop: 10 },
  
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  scrollContent: { paddingBottom: 20 },
  
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 50, // Bordas bem arredondadas como na imagem
    marginBottom: 16,
    height: 60,
  },
  itemLabel: { fontWeight: '600', fontSize: 16 },
  
  logoutButton: {
    borderRadius: 30,
    marginTop: 20,
  }
});

export default SettingsScreen;