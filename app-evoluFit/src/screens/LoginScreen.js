import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import AuthLayout from '../components/AuthLayout';
import CustomInput from '../components/CustomInput';
import { authService } from '../services/auth';
import { useAppTheme } from '../context/ThemeContext'; // <--- MUDANÇA 1

const LoginScreen = ({ navigation }) => {
  const { theme } = useAppTheme(); // <--- MUDANÇA 2
  const [email, setEmail] = useState('user@email.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      // Sucesso: Use replace para não deixar voltar para o login
      navigation.replace('Dashboard'); 
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <CustomInput
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <CustomInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        right={
          <CustomInput.Icon 
            icon={showPassword ? "eye-off" : "eye"} 
            onPress={() => setShowPassword(!showPassword)}
            color={theme.colors.secondaryText} // Ícone com cor do tema
          />
        }
      />

      <View style={styles.forgotPasswordContainer}>
        {/* Texto do link agora usa theme.colors.primary */}
        <Text 
            style={[styles.linkText, { color: theme.colors.primary }]} 
            onPress={() => console.log('Recuperar senha')}
        >
          Esqueceu a senha?
        </Text>
      </View>

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={[styles.button, { backgroundColor: theme.colors.primary }]} // Botão com cor do tema
        contentStyle={{ height: 50 }}
        labelStyle={{ color: theme.dark ? '#FFF' : '#FFF' }}
      >
        Entrar
      </Button>

      <View style={styles.footer}>
        <Text style={{ color: theme.colors.secondaryText }}>Não tem uma conta? </Text>
        <Text 
            style={[styles.linkText, { color: theme.colors.primary }]} 
            onPress={() => navigation.navigate('Register')}
        >
          Cadastre-se
        </Text>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  forgotPasswordContainer: { alignItems: 'flex-end', marginBottom: 20 },
  linkText: { fontWeight: 'bold' },
  button: { borderRadius: 25 },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 30, 
    marginBottom: 20 
  },
});

export default LoginScreen;