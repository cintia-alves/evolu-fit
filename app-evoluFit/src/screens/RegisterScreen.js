import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import AuthLayout from '../components/AuthLayout';
import CustomInput from '../components/CustomInput';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext'; // Importe o hook

const RegisterScreen = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { signUp } = useAuth(); // Pegamos a função do contexto

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
        Alert.alert('Erro', 'Preencha todos os campos');
        return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      // Envia os dados para a API real
      await signUp({ 
        nome: name,
        email: email, 
        senha: password,
        avatar: 0 
      });
      navigation.navigate('Success'); 
    } catch (error) {
      Alert.alert('Erro no Cadastro', error.message || 'Tente novamente mais tarde');
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
        buttonColor={theme.colors.primary}
        textColor="#FFF"
      >
        Criar Conta
      </Button>

      <Button 
        mode="text" 
        onPress={() => navigation.goBack()} 
        style={{ marginTop: 20 }}
        textColor={theme.colors.primary}
      >
        Já tenho uma conta
      </Button>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  button: { borderRadius: 25, marginTop: 10 },
});

export default RegisterScreen;