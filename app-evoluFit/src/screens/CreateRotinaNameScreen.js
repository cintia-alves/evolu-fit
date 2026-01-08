import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton, Button, Avatar } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';
import CustomInput from '../components/CustomInput';
import { rotinaService } from '../services/rotinaService';

const CreateRotinaNameScreen = ({ navigation }) => {
  const { theme } = useAppTheme();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      const usuarioId = 1; // Hardcoded por enquanto, depois pegaremos do Contexto de Auth
      const novaRotina = await rotinaService.create(name, usuarioId);
      
      navigation.navigate('RotinaDetail', { rotinaData: novaRotina });
      
    } catch (error) {
      alert('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      {/* Header Simples */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" iconColor="#FFF" size={24} onPress={() => navigation.goBack()} style={{ alignSelf: 'flex-start' }} />
        <View style={styles.iconContainer}>
            <Avatar.Icon size={80} icon="dumbbell" style={{ backgroundColor: '#00C2FF' }} />
            <Text variant="headlineMedium" style={styles.appTitle}>EvoluFit</Text>
        </View>
      </View>

      {/* Conteúdo Branco */}
      <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.body}>
            <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.primary }]}>
                Dê um nome a sua{"\n"}rotina de treinos
            </Text>

            <CustomInput 
                label="Nome"
                placeholder="Ex: “Rotina A”"
                value={name}
                onChangeText={setName}
            />
        </View>

        {/* Footer com Paginação e Botão */}
        <View style={styles.footer}>
            <View style={styles.pagination}>
                <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
                <View style={[styles.dot, { backgroundColor: '#DDD' }]} />
            </View>

            <Button 
                mode="contained" 
                onPress={handleNext} 
                loading={loading}
                style={styles.btnNext}
                contentStyle={{ height: 50 }}
                buttonColor={theme.colors.primary}
            >
                Proximo
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
  
  contentContainer: { 
    flex: 1, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 24,
    justifyContent: 'space-between'
  },
  body: { marginTop: 20 },
  title: { fontWeight: 'bold', marginBottom: 30 },
  
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  pagination: { flexDirection: 'row', gap: 8 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  btnNext: { borderRadius: 25, paddingHorizontal: 20 }
});

export default CreateRotinaNameScreen;