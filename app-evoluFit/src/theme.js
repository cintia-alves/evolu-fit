// src/theme.js
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// ... (Mantenha as definições de lightColors e darkColors que passei antes) ...
const lightColors = {
  primary: '#103B66',
  background: '#F8F9FC',
  surface: '#FFFFFF',
  surfaceVariant: '#F5F6FA',
  text: '#000000',
  secondaryText: '#666666',
  accent: '#00C2FF',
  error: '#B00020',
};

const darkColors = {
  primary: '#51A2FF',
  background: '#030712', // Azul escuro fundo
  surface: '#1D293D',    // Azul acinzentado cards
  surfaceVariant: '#2A3B55',
  text: '#FFFFFF',
  secondaryText: '#A0A0A0',
  accent: '#00C2FF',
  error: '#CF6679',
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...lightColors,
  },
  roundness: 8,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...darkColors,
    background: darkColors.background,
    surface: darkColors.surface,
  },
  roundness: 8,
};

// ADICIONE ESTA LINHA PARA CORRIGIR O ERRO "UNDEFINED":
export const theme = lightTheme;