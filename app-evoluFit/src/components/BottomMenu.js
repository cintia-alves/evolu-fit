import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomMenu = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation();
  const route = useRoute(); 
  const insets = useSafeAreaInsets(); 

  const getColor = (routeName) => {
    return route.name === routeName ? theme.colors.primary : theme.colors.secondaryText;
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.colors.surface, 
        borderTopColor: theme.colors.surfaceVariant,
        paddingBottom: Math.max(insets.bottom, 10),
        height: 60 + Math.max(insets.bottom, 10) 
      }
    ]}>
      
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

      <TouchableOpacity 
        style={styles.item}
        onPress={() => navigation.navigate('History')} 
      >
        <IconButton 
          icon={route.name === 'History' ? "history" : "history"} // Pode variar o icone se quiser
          iconColor={getColor('History')} 
          size={28} 
          style={styles.icon} 
        />
        <Text style={[styles.label, { color: getColor('History') }]}>Histórico</Text>
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
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  item: { 
    alignItems: 'center', 
    justifyContent: 'center',
    flex: 1, 
  },
  icon: {
    margin: 0, 
    marginBottom: -5 
  },
  label: { 
    fontSize: 12, 
    marginTop: 0,
    fontWeight: '500'
  }
});

export default BottomMenu;