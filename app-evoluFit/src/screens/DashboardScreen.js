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
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const DashboardScreen = ({ navigation }) => {
  const { theme } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [rotinas, setRotinas] = useState([]);

  const [rotinaAtiva, setRotinaAtiva] = useState(null); // Rotina ativa (para ID)
  const [treinoHoje, setTreinoHoje] = useState(null);   // Dados do treino de hoje (com categorias)
  const [temRotina, setTemRotina] = useState(false);

  const { user } = useAuth();

  console.log("TREINO DE HOJE", treinoHoje)

  // Função para carregar tudo
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const dashData = await dashboardService.getData();
      const userName = user?.nome || user?.name || 'Visitante';
      setDashboardData({ ...dashData, user: { name: userName } });

      if (user?.id) {
          const userRotinas = await rotinaService.getByUser(user.id);
          
          if (userRotinas && userRotinas.length > 0) {
              setTemRotina(true);
              const ativa = userRotinas.find(r => r.ativa === 1) || userRotinas[0];
              setRotinaAtiva(ativa);

              const diaSemanaHoje = new Date().getDay();
              let treinoDoDia = null;

              try {
                  const response = await api.get(`/treinos/dia/${diaSemanaHoje}/${ativa.id}`);
                  treinoDoDia = response;
              } catch (error) {
                  // Se for 404 ou mensagem de "nenhum treino", é descanso
                  if (error.message?.includes('Nenhum treino') || error.message?.includes('404')) {
                      treinoDoDia = null;
                  } else {
                      console.error("Erro ao carregar treino do dia:", error);
                  }
              }

              setTreinoHoje(treinoDoDia)
          } else {
              setTemRotina(false);
              setRotinaAtiva(null);
              setTreinoHoje(null);
          }
      }
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
    }, [user])
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
  const ActiveRoutineCard = () => {
      const isConcluido = treinoHoje.concluido === 1;

      if (!treinoHoje) {
          return (
            <View style={styles.activeCard}>
                <View style={styles.activeCardHeader}>
                    <View style={styles.iconCircle}>
                        <Avatar.Icon size={40} icon="dumbbell" style={{ backgroundColor: 'transparent' }} color="#FFF" />
                    </View>
                    <Text style={styles.headerText}>Sem treino hoje</Text>
                </View>
                <Text variant="headlineMedium" style={styles.routineTitle}>Descanso</Text>
                <Text style={{ color: '#DDD', marginBottom: 20 }}>Aproveite para recuperar as energias!</Text>
                <Button 
                    mode="contained" 
                    onPress={() => navigation.navigate('RotinaDetail', { rotinaData: rotinaAtiva })}
                    style={styles.startBtn} buttonColor="#F5F6FA" textColor="#103B66"
                >
                    VER MINHA ROTINA
                </Button>
            </View>
          );
      }

      return (
        <View style={styles.activeCard}>
          <View style={styles.activeCardHeader}>
            <View style={styles.iconCircle}>
               <Avatar.Icon size={40} icon="calendar-check" style={{ backgroundColor: 'transparent' }} color="#FFF" />
            </View>
            <Text style={styles.headerText}>Treino de hoje</Text>
          </View>

          {/* Nome do Treino (Ex: Treino A) */}
          <Text variant="headlineMedium" style={styles.routineTitle}>
            {treinoHoje.nome}
          </Text>

          {/* Badges de Categorias (Grupos Musculares) */}
          <View style={styles.tagsRow}>
            {treinoHoje.grupos && treinoHoje.grupos.map((grupo, index) => (
                <Chip key={index} style={styles.chipLight} textStyle={styles.chipTextDark}>{grupo}</Chip>
            ))}
            {(!treinoHoje.grupos || treinoHoje.grupos.length === 0) && (
                 <Chip style={styles.chipLight} textStyle={styles.chipTextDark}>Geral</Chip>
            )}
          </View>

          {/* Badges Info (Qtd e Nome Rotina) */}
          <View style={styles.tagsRow}>
            <Chip style={styles.chipDark} textStyle={styles.chipTextLight}>
                {treinoHoje.total_exercicios} exercícios
            </Chip>
            <Chip style={styles.chipDark} textStyle={styles.chipTextLight}>
                 {treinoHoje.rotina_nome}
            </Chip>
          </View>

          {isConcluido ? (
              <Button 
                mode="contained" 
                style={[styles.startBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                textColor="#FFF"
                contentStyle={{ height: 55 }}
                disabled
              >
                TREINO FINALIZADO
              </Button>
          ) : (
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('ExecucaoTreino', { 
                    treinoId: treinoHoje.id,
                    diaNome: treinoHoje.dia_nome 
                })}
                style={styles.startBtn}
                buttonColor="#F5F6FA"
                textColor="#103B66"
                contentStyle={{ height: 55, flexDirection: 'row-reverse' }}
                icon="arrow-right"
              >
                INICIAR TREINO
              </Button>
          )}

          {/* <View style={styles.secondaryBtnRow}>
            <Button icon="calendar" mode="contained" style={styles.secBtn} buttonColor="#2A405F" textColor="#FFF">Mudar data</Button>
            <Button icon="close" mode="contained" style={styles.secBtn} buttonColor="#2A405F" textColor="#FFF">Não fui</Button>
          </View> */}
        </View>
      );
  };

  console.log(dashboardData)

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
        {temRotina ? <ActiveRoutineCard /> : <EmptyStateCard />}

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