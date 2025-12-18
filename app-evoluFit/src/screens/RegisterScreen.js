import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import AuthLayout from '../components/AuthLayout';
import CustomInput from '../components/CustomInput';
import { authService } from '../services/auth';
import { theme } from '../theme';

const RegisterScreen = ({ onNavigateToLogin, onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await authService.register({ name, email, password });
      onRegisterSuccess(); 
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <CustomInput label="Nome Completo" value={name} onChangeText={setName} />
      <CustomInput label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <CustomInput label="Senha" value={password} onChangeText={setPassword} secureTextEntry />
      <CustomInput label="Confirmar Senha" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        disabled={loading}
        style={styles.button}
        contentStyle={{ height: 50 }}
      >
        Criar Conta
      </Button>

      <Button 
        mode="text" 
        onPress={onNavigateToLogin} 
        style={{ marginTop: 20 }}
        textColor={theme.colors.primary}
      >
        Já tenho uma conta
      </Button>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  button: { borderRadius: 25, backgroundColor: theme.colors.primary, marginTop: 10 },
});

export default RegisterScreen;