import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';
import BottomMenu from '../components/BottomMenu';

const HistoryScreen = () => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
            <Avatar.Icon 
                size={80} 
                icon="clock-time-three-outline" 
                style={{ backgroundColor: 'rgba(16, 59, 102, 0.1)' }} 
                color={theme.colors.primary}
            />
        </View>
        
        <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.primary }]}>
            Em breve!
        </Text>
        
        <Text variant="bodyLarge" style={[styles.text, { color: theme.colors.secondaryText }]}>
          Estamos trabalhando nisso, em breve você poderá ver seu histórico de treinos aqui.
        </Text>
      </View>

      <BottomMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
    lineHeight: 24,
  }
});

export default HistoryScreen;