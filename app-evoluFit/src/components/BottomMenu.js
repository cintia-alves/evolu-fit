import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomMenu = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation();
  const route = useRoute(); // Pega a rota atual (ex: 'Dashboard', 'Rotinas')
  const insets = useSafeAreaInsets(); // Pega as medidas de segurança da tela

  // Função auxiliar para definir a cor baseada na rota ativa
  const getColor = (routeName) => {
    return route.name === routeName ? theme.colors.primary : theme.colors.secondaryText;
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.colors.surface, 
        borderTopColor: theme.colors.surfaceVariant,
        // Adiciona padding bottom dinâmico (insets.bottom) + um respiro fixo (10)
        paddingBottom: Math.max(insets.bottom, 10),
        height: 60 + Math.max(insets.bottom, 10) // Ajusta altura total baseada no safe area
      }
    ]}>
      
      {/* Botão Tela Inicial */}
      <TouchableOpacity 
        style={styles.item} 
        onPress={() => navigation.navigate('Dashboard')}
      >
        <IconButton 
          icon={route.name === 'Dashboard' ? "home" : "home-outline"} 
          iconColor={getColor('Dashboard')} 
          size={28} 
          style={styles.icon} 
        />
        <Text style={[styles.label, { color: getColor('Dashboard') }]}>Tela inicial</Text>
      </TouchableOpacity>
      
      {/* Botão Rotina */}
      <TouchableOpacity 
        style={styles.item} 
        onPress={() => navigation.navigate('Rotinas')}
      >
        <IconButton 
          icon={route.name === 'Rotinas' ? "calendar-check" : "calendar-blank-outline"} 
          iconColor={getColor('Rotinas')} 
          size={28} 
          style={styles.icon} 
        />
        <Text style={[styles.label, { color: getColor('Rotinas') }]}>Rotina</Text>
      </TouchableOpacity>

      {/* Botão Histórico (Inativo por enquanto, cor fixa secundária) */}
      <TouchableOpacity style={styles.item}>
        <IconButton 
          icon="history" 
          iconColor={theme.colors.secondaryText} 
          size={28} 
          style={styles.icon} 
        />
        <Text style={[styles.label, { color: theme.colors.secondaryText }]}>Histórico</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
    elevation: 8, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  item: { 
    alignItems: 'center', 
    justifyContent: 'center',
    flex: 1, // Garante área de toque melhor
  },
  icon: {
    margin: 0, // Remove margem padrão do IconButton para alinhar melhor
    marginBottom: -5 // Aproxima o ícone do texto
  },
  label: { 
    fontSize: 12, 
    marginTop: 0,
    fontWeight: '500'
  }
});

export default BottomMenu;