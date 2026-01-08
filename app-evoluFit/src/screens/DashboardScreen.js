import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Avatar, Button, ActivityIndicator, Chip, IconButton } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native'; // Importante para recarregar ao voltar
import { useAppTheme } from '../context/ThemeContext';
import { dashboardService } from '../services/dashboard';
import { rotinaService } from '../services/rotinaService';

import DateStrip from '../components/DateStrip';
import QuickAccessCard from '../components/QuickAccessCard';
import BottomMenu from '../components/BottomMenu';

const DashboardScreen = ({ navigation }) => {
  const { theme } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [rotinas, setRotinas] = useState([]);

  console.log(rotinas[0])

  // Função para carregar tudo
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Dados do calendário/usuário
      const dashData = await dashboardService.getData();
      setDashboardData(dashData);

      // 2. Buscar rotinas do usuário (ID 1 hardcoded por enquanto)
      const userRotinas = await rotinaService.getByUser(1);
      setRotinas(userRotinas || []);
      
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // UseFocusEffect garante que os dados atualizem quando você volta da tela de criação
  useFocusEffect(
    useCallback(() => {
      fetchAllData();
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator animating={true} color={theme.colors.primary} />
      </View>
    );
  }

  // --- COMPONENTE: Card quando NÃO tem rotina ---
  const EmptyStateCard = () => (
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
        onPress={() => navigation.navigate('CreateRotinaName')}
        style={styles.createBtn}
        buttonColor={theme.colors.primary}
        textColor="#FFF"
        contentStyle={{ height: 50 }}
      >
        Criar minha primeira rotina
      </Button>
    </View>
  );

  // --- COMPONENTE: Card quando TEM rotina (Novo Design) ---
  const ActiveRoutineCard = ({ rotina }) => (
    <View style={styles.activeCard}>
      <View style={styles.activeCardHeader}>
        <View style={styles.iconCircle}>
           <Avatar.Icon size={40} icon="dumbbell" style={{ backgroundColor: 'transparent' }} color="#FFF" />
        </View>
        <Text style={styles.headerText}>Treino de hoje</Text>
      </View>

      {/* Nome da Rotina ou Aviso */}
      <Text variant="headlineMedium" style={styles.routineTitle}>
        {rotina?.nome || "Rotina sem nome"}
      </Text>

      {/* Tags de Grupos Musculares (Mockados pois a API de listagem não retorna isso ainda) */}
      <View style={styles.tagsRow}>
        <Chip style={styles.chipLight} textStyle={styles.chipTextDark}>Peito</Chip>
        <Chip style={styles.chipLight} textStyle={styles.chipTextDark}>Posterior de Coxas</Chip>
      </View>

      {/* Tags de Info Extra */}
      <View style={styles.tagsRow}>
        <Chip style={styles.chipDark} textStyle={styles.chipTextLight}>2 exercícios</Chip>
        <Chip style={styles.chipDark} textStyle={styles.chipTextLight}>
             {rotina?.nome ? `Rotina ${rotina.nome.substring(0, 8)}...` : 'Rotina Personalizada'}
        </Chip>
      </View>

      {/* Botão Principal */}
      <Button 
        mode="contained" 
        onPress={() => console.log("Iniciar Treino")}
        style={styles.startBtn}
        buttonColor="#F5F6FA"
        textColor="#103B66"
        contentStyle={{ height: 55, flexDirection: 'row-reverse' }}
        icon="arrow-right"
      >
        INICIAR TREINO
      </Button>

      {/* Botões Secundários */}
      <View style={styles.secondaryBtnRow}>
        <Button 
            icon="calendar" 
            mode="contained" 
            style={styles.secBtn} 
            buttonColor="#2A405F" 
            textColor="#FFF"
        >
            Mudar data
        </Button>
        <Button 
            icon="close" 
            mode="contained" 
            style={styles.secBtn} 
            buttonColor="#2A405F" 
            textColor="#FFF"
        >
            Não fui
        </Button>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="headlineMedium" style={{ fontWeight: 'bold', color: theme.colors.primary }}>
              Olá, {dashboardData?.user?.name}!
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Avatar.Icon size={50} icon="account" style={{ backgroundColor: '#00C2FF' }} />
          </TouchableOpacity>
        </View>

        <DateStrip 
            data={dashboardData?.calendar} 
            selectedMonth={dashboardData?.currentDate} 
        />

        {/* Lógica de Exibição do Card */}
        {rotinas.length > 0 ? (
            // Pega a primeira rotina encontrada
            <ActiveRoutineCard rotina={rotinas[0]} />
        ) : (
            <EmptyStateCard />
        )}

        {/* Quick Access */}
        <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.secondaryText }]}>
          Acesso rápido
        </Text>
        <View style={styles.grid}>
          <QuickAccessCard 
            title="Gráficos" 
            subtitle="Veja seu Progresso" 
            icon="chart-line" 
            onPress={() => {}}
          />
          <QuickAccessCard 
            title="Medidas" 
            subtitle="Acompanhe suas medidas" 
            icon="ruler" 
            onPress={() => {}}
          />
        </View>

      </ScrollView>

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
  
  // Estilos do Card Vazio
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

  // Estilos do Card Ativo (Novo)
  activeCard: {
    backgroundColor: '#102A45', // Azul escuro do print
    margin: 20,
    borderRadius: 25,
    padding: 20,
    elevation: 5,
  },
  activeCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  iconCircle: { 
    backgroundColor: '#00C2FF', 
    borderRadius: 20, 
    padding: 5, 
    marginRight: 10 
  },
  headerText: { color: '#FFF', fontSize: 16 },
  routineTitle: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    marginBottom: 15 
  },
  tagsRow: { flexDirection: 'row', marginBottom: 10, gap: 8, flexWrap: 'wrap' },
  chipLight: { backgroundColor: '#87CEFA', borderRadius: 15 }, // Azul claro
  chipTextDark: { color: '#000', fontWeight: 'bold', fontSize: 12 },
  chipDark: { backgroundColor: '#34495E', borderRadius: 15 }, // Azul acinzentado
  chipTextLight: { color: '#FFF', fontSize: 12 },
  
  startBtn: { 
    borderRadius: 25, 
    marginTop: 15, 
    marginBottom: 15,
    fontWeight: 'bold'
  },
  secondaryBtnRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  secBtn: { flex: 1, borderRadius: 20 },

  sectionTitle: { marginLeft: 20, marginBottom: 15, fontWeight: 'bold' },
  grid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }
});

export default DashboardScreen;