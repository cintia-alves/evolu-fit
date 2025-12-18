import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { theme } from '../theme';

const SuccessScreen = ({ onStart }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium" style={styles.successText}>
          Sua conta foi criada{"\n"}com sucesso
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={onStart}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          contentStyle={{ height: 55 }}
        >
          Vamos começar?
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary, // #103B66
    paddingHorizontal: 30,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 40,
    fontWeight: '500',
  },
  footer: {
    paddingBottom: 50, // Espaçamento inferior para o botão
  },
  button: {
    backgroundColor: '#FFF',
    borderRadius: 30,
  },
  buttonLabel: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SuccessScreen;