import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import AuthLayout from '../components/AuthLayout';
import CustomInput from '../components/CustomInput';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext'; // Importe o hook

const LoginScreen = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { signIn } = useAuth(); // Pegamos a função do contexto
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      // Chama a função do contexto que bate na API e salva o user
      await signIn(email, password); 
      navigation.replace('Dashboard'); 
    } catch (error) {
      Alert.alert('Erro no Login', error.message || 'Verifique suas credenciais');
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
            color={theme.colors.secondaryText}
          />
        }
      />

      <View style={styles.forgotPasswordContainer}>
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
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
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