import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Avatar, Button, ActivityIndicator } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext'; // Importe o hook
import { dashboardService } from '../services/dashboard';

import DateStrip from '../components/DateStrip';
import QuickAccessCard from '../components/QuickAccessCard';
import BottomMenu from '../components/BottomMenu';

const DashboardScreen = ({ onNavigateToSettings }) => {
  const { theme } = useAppTheme(); // Pegar o tema atual
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadData() {
      const response = await dashboardService.getData();
      setData(response);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator animating={true} color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
              Olá, {data?.user?.name}!
            </Text>
          </View>
          <TouchableOpacity onPress={onNavigateToSettings}>
            <Avatar.Icon size={50} icon="account" style={{ backgroundColor: '#00C2FF' }} />
          </TouchableOpacity>
        </View>

        <DateStrip data={data?.calendar} />

        {/* Main Journey Card */}
        <View style={[styles.mainCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.mainIconContainer}>
               <Image
                    source={require('../../assets/logo.png')}
                    style={{ width: 104, height: 102 }}
                />
            </View>
            
            <Text variant="titleLarge" style={[styles.cardTitle, { color: theme.colors.text }]}>
              Comece sua jornada!
            </Text>
            <Text style={[styles.cardDesc, { color: theme.colors.secondaryText }]}>
              Você ainda não tem uma rotina de treino. Crie agora e comece a evoluir!
            </Text>

            <Button 
              mode="contained" 
              icon="plus"
              onPress={() => console.log('Criar rotina')}
              style={styles.createBtn}
              buttonColor={theme.colors.primary}
              textColor="#FFF"
              contentStyle={{ height: 50 }}
            >
              Criar minha primeira rotina
            </Button>
        </View>

        {/* Quick Access */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.secondaryText }]}>
          Acesso rápido
        </Text>
        <View style={styles.grid}>
          <QuickAccessCard 
            title="Gráficos" 
            subtitle="Veja seu Progresso" 
            icon="chart-line" 
          />
          <QuickAccessCard 
            title="Medidas" 
            subtitle="Acompanhe suas medidas" 
            icon="ruler" 
          />
        </View>

      </ScrollView>

      {/* Passar o tema para o BottomMenu também se necessário, ou ele herda estilos globais */}
      <BottomMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
    marginBottom: 10,
  },
  mainCard: {
    margin: 20,
    borderRadius: 25,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
  },
  mainIconContainer: { marginBottom: 15 },
  cardTitle: { fontWeight: 'bold', marginBottom: 8 },
  cardDesc: { textAlign: 'center', marginBottom: 20, paddingHorizontal: 10 },
  createBtn: { width: '100%', borderRadius: 15 },
  sectionTitle: { marginLeft: 20, marginBottom: 15, fontWeight: 'bold' },
  grid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }
});

export default DashboardScreen;