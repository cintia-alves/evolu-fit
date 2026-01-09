import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, Button, Avatar } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext'; // Importe o Auth
import CustomInput from '../components/CustomInput';
import { rotinaService } from '../services/rotinaService';

const CreateRotinaNameScreen = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { user } = useAuth(); // Pegamos o user real aqui
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  console.log(user)

  const handleNext = async () => {
    if (!name.trim()) return;
    if (!user || !user.id) {
        alert("Erro: Usuário não identificado. Faça login novamente.");
        return;
    }

    setLoading(true);
    try {
      // Usamos user.id real
      console.log(user.id)
      const novaRotina = await rotinaService.create(name, user.id);
      // Navega para a tela de Detalhes passando a nova rotina
      navigation.navigate('RotinaDetail', { rotinaData: novaRotina });
    } catch (error) {
      alert('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ... (Restante do JSX e Styles igual, sem alterações)
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" iconColor="#FFF" size={24} onPress={() => navigation.goBack()} style={{ alignSelf: 'flex-start' }} />
        <View style={styles.iconContainer}>
            <Avatar.Icon size={80} icon="dumbbell" style={{ backgroundColor: '#00C2FF' }} />
            <Text variant="headlineMedium" style={styles.appTitle}>EvoluFit</Text>
        </View>
      </View>

      <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.body}>
            <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.primary }]}>
                Dê um nome a sua{"\n"}rotina de treinos
            </Text>
            <CustomInput label="Nome" placeholder="Ex: “Rotina A”" value={name} onChangeText={setName} />
        </View>

        <View style={styles.footer}>
            <Button mode="contained" onPress={handleNext} loading={loading} style={styles.btnNext} contentStyle={{ height: 50 }} buttonColor={theme.colors.primary}>
                Criar Rotina
            </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: '30%', alignItems: 'center', paddingTop: 40, paddingHorizontal: 10 },
  iconContainer: { alignItems: 'center', marginTop: 10 },
  appTitle: { color: '#FFF', fontWeight: 'bold', marginTop: 10 },
  contentContainer: { flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, justifyContent: 'space-between' },
  body: { marginTop: 20 },
  title: { fontWeight: 'bold', marginBottom: 30 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 20 },
  pagination: { flexDirection: 'row', gap: 8 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  btnNext: { borderRadius: 25, paddingHorizontal: 20 }
});

export default CreateRotinaNameScreen;