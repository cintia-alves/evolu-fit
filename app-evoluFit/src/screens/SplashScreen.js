import React from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import { Text, Avatar, ActivityIndicator } from 'react-native-paper';
import { theme } from '../theme';

const SplashScreen = () => {
  // Opcional: Você pode adicionar uma animação de FadeIn aqui depois
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
            source={require('../../assets/logo.png')}
            style={{ width: 100, height: 100 }}
        />
        <Text variant="headlineLarge" style={styles.title}>EvoluFit</Text>
        
        {/* Indicador de progresso logo abaixo do texto */}
        <ActivityIndicator 
          animating={true} 
          color="#00C2FF" 
          size="small" 
          style={styles.loader} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary, // #103B66
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    backgroundColor: '#00C2FF',
    marginBottom: 15,
    elevation: 10,
  },
  title: {
    color: '#FFF',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  loader: {
    marginTop: 30,
  }
});

export default SplashScreen;