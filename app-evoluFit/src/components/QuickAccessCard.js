import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text, Avatar, IconButton } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';

const QuickAccessCard = ({ title, subtitle, icon, onPress }) => {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surface }]} onPress={onPress}>
      <View>
        <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.text }}>
          {title}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.secondaryText, marginTop: 4 }}>
          {subtitle}
        </Text>
      </View>
      <View style={styles.footer}>
        {/* Ícone com fundo transparente, cor baseada no tema */}
        <Avatar.Icon size={40} icon={icon} style={{ backgroundColor: 'transparent' }} color={theme.colors.primary} />
        <IconButton icon="arrow-right" size={20} iconColor={theme.colors.primary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    width: '48%',
    height: 140,
    justifyContent: 'space-between',
    marginBottom: 16,
    elevation: 1,
  },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
});

export default QuickAccessCard;