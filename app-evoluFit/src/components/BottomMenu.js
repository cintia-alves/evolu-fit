import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const BottomMenu = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.surfaceVariant }]}>
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Dashboard')}>
        <IconButton icon="home" iconColor={theme.colors.primary} size={28} style={{ margin: 0 }} />
        <Text style={[styles.label, { color: theme.colors.primary }]}>Tela inicial</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Rotinas')}>
        <IconButton icon="calendar-check" iconColor={theme.colors.secondaryText} size={28} style={{ margin: 0 }} />
        <Text style={[styles.label, { color: theme.colors.secondaryText }]}>Rotina</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <IconButton icon="history" iconColor={theme.colors.secondaryText} size={28} style={{ margin: 0 }} />
        <Text style={[styles.label, { color: theme.colors.secondaryText }]}>Histórico</Text>
      </TouchableOpacity>
    </View>
  );
};
// ... styles mantém container flex, padding etc, mas remove background fixo
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  item: { alignItems: 'center' },
  label: { fontSize: 10, marginTop: -5 }
});
export default BottomMenu;