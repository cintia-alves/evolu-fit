import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';

const CustomInput = ({ style, ...props }) => {
  const { theme } = useAppTheme();

  return (
    <TextInput
      mode="outlined"
      outlineColor={theme.dark ? '#444' : '#DDD'} // Borda mais escura no dark mode
      activeOutlineColor={theme.colors.primary}
      style={[
        styles.input, 
        { backgroundColor: theme.colors.surfaceVariant }, // Fundo muda com o tema
        style
      ]}
      textColor={theme.colors.text}
      theme={{ roundness: 8 }}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
  },
});

export default CustomInput;