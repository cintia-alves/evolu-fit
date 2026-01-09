import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text, Avatar, IconButton } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';

const QuickAccessCard = ({ title, subtitle, icon, onPress, comingSoon }) => {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity 
        style={[styles.card, { backgroundColor: theme.colors.surface }]} 
        onPress={comingSoon ? null : onPress}
        activeOpacity={comingSoon ? 1 : 0.7}
    >
      <View>
        <Text variant="titleMedium" style={{ fontWeight: 'bold', color: theme.colors.text }}>
          {title}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.secondaryText, marginTop: 4 }}>
          {subtitle}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Avatar.Icon size={40} icon={icon} style={{ backgroundColor: 'transparent' }} color={theme.colors.primary} />
        {/* Se for Em breve, não mostra a seta */}
        {!comingSoon && (
            <IconButton icon="arrow-right" size={20} iconColor={theme.colors.primary} />
        )}
      </View>

      {/* FAIXA "EM BREVE" */}
      {comingSoon && (
        <View style={styles.ribbonContainer}>
            <View style={styles.ribbon}>
                <Text style={styles.ribbonText}>Em breve</Text>
            </View>
        </View>
      )}
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
    overflow: 'hidden', // Importante para cortar a faixa
    position: 'relative'
  },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  
  // Estilos da Faixa
  ribbonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 80,
    height: 80,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  ribbon: {
    backgroundColor: '#F5A623', // Cor laranja/amarela de "construção" ou alerta
    width: 120,
    marginTop: 15,
    marginRight: -35,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  ribbonText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }
});

export default QuickAccessCard;