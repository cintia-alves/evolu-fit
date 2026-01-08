import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Avatar, Button, IconButton, RadioButton, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../context/ThemeContext';
import { rotinaService } from '../services/rotinaService';
import { api } from '../services/api'; // Precisamos chamar API direta para pegar treinos de cada rotina
import BottomMenu from '../components/BottomMenu';

const RotinasScreen = ({ navigation }) => {
  const { theme } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [rotinas, setRotinas] = useState([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState(null); // ID da rotina ativa na dashboard

  // Função auxiliar para mapear dias da semana (0=Dom, 6=Sab) para letras
  const weekLetters = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // Função para buscar rotinas e seus treinos
  const fetchRotinas = async () => {
    setLoading(true);
    try {
      // 1. Busca todas as rotinas do usuário
      const userRotinas = await rotinaService.getByUser(1); // ID 1 hardcoded
      
      // 2. Para cada rotina, busca os detalhes (treinos) para saber os dias
      const rotinasComDetalhes = await Promise.all(
        userRotinas.map(async (rotina) => {
          try {
            const detalhes = await api.get(`/rotinas/${rotina.id}`);
            return detalhes; // Retorna objeto completo com array 'treinos'
          } catch (e) {
            return { ...rotina, treinos: [] };
          }
        })
      );

      setRotinas(rotinasComDetalhes);
      
      // Seleciona a primeira como padrão se nenhuma estiver selecionada
      if (rotinasComDetalhes.length > 0 && !selectedRoutineId) {
        setSelectedRoutineId(rotinasComDetalhes[0].id);
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRotinas();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert(
      "Excluir Rotina",
      "Tem certeza que deseja deletar esta rotina?",
      [
        { text: "Não", style: "cancel" },
        { 
          text: "Sim", 
          onPress: async () => {
            // await api.delete(`/rotinas/${id}`); // Implementar no service depois
            // fetchRotinas();
            console.log("Deletar rotina", id);
          } 
        }
      ]
    );
  };

  // Componente interno para renderizar as bolinhas dos dias
  const WeekDaysBadges = ({ treinos }) => {
    // Cria um Set com os índices dos dias da semana que têm treino
    const activeDays = new Set();
    
    if (treinos && treinos.length > 0) {
      treinos.forEach(treino => {
        // Supondo que treino.data venha no formato "YYYY-MM-DD" ou ISO
        // Se a data for fixa, usamos new Date(treino.data).getDay()
        // Se a lógica for apenas "dias da semana", precisariamos de um campo "dia_semana" no banco
        // Como o prompt pediu para extrair da data:
        if (treino.data) {
            const dayIndex = new Date(treino.data).getDay(); // 0-6
            activeDays.add(dayIndex);
        }
      });
    }

    return (
      <View style={styles.daysContainer}>
        {weekLetters.map((letter, index) => {
          const isActive = activeDays.has(index);
          return (
            <View 
              key={index} 
              style={[
                styles.dayBadge, 
                { backgroundColor: isActive ? '#A0B4D6' : 'rgba(255,255,255,0.2)' } // Azul claro ativo, transparente inativo
              ]}
            >
              <Text style={{ fontSize: 10, color: '#FFF', fontWeight: 'bold' }}>{letter}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#103B66' }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" iconColor="#FFF" size={24} onPress={() => navigation.goBack()} />
        <View style={styles.iconHeader}>
            <Avatar.Icon size={80} icon="dumbbell" style={{ backgroundColor: '#00C2FF' }} />
            <Text variant="headlineSmall" style={styles.headerTitle}>Rotinas</Text>
        </View>
        <View style={{ width: 40 }} /> 
      </View>

      <View style={styles.addButtonContainer}>
        <Button 
            mode="contained" 
            icon="plus" 
            onPress={() => navigation.navigate('CreateRotinaName')}
            style={styles.addButton}
            buttonColor="#FFF"
            textColor="#103B66"
        >
            Adicionar Rotina
        </Button>
      </View>

      {/* Lista de Rotinas */}
      <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
        {loading ? (
            <ActivityIndicator animating={true} color={theme.colors.primary} style={{ marginTop: 50 }} />
        ) : (
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {rotinas.map((rotina) => (
                    <View key={rotina.id} style={styles.card}>
                        {/* Topo Azul do Card */}
                        <View style={styles.cardHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.calendarIcon}>
                                    <IconButton icon="calendar-month" iconColor="#103B66" size={24} />
                                </View>
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={styles.cardTitle}>{rotina.nome}</Text>
                                    <WeekDaysBadges treinos={rotina.treinos} />
                                </View>
                            </View>

                            <View style={styles.cardActions}>
                                <TouchableOpacity onPress={() => handleDelete(rotina.id)}>
                                    <IconButton icon="delete-outline" iconColor="#FFF" size={20} />
                                </TouchableOpacity>
                                
                                {/* Radio Button Customizado */}
                                <TouchableOpacity onPress={() => setSelectedRoutineId(rotina.id)}>
                                    <View style={[
                                        styles.radioOuter, 
                                        selectedRoutineId === rotina.id && { borderColor: '#FFF' }
                                    ]}>
                                        {selectedRoutineId === rotina.id && <View style={styles.radioInner} />}
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Rodapé Branco do Card */}
                        <TouchableOpacity style={styles.cardFooter}>
                            <Text style={[styles.footerText, { color: theme.colors.primary }]}>Treinos</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        )}
      </View>

      <BottomMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    paddingTop: 40, 
    paddingHorizontal: 10 
  },
  iconHeader: { alignItems: 'center', marginTop: -20 },
  headerTitle: { color: '#FFF', fontWeight: 'bold', marginTop: 10 },
  
  addButtonContainer: { alignItems: 'center', marginBottom: 20 },
  addButton: { borderRadius: 25, width: '60%' },

  contentContainer: { 
    flex: 1, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    paddingTop: 30,
    paddingHorizontal: 20
  },
  scrollContent: { paddingBottom: 80 },

  // Card Styles
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 3,
    backgroundColor: '#FFF' // Fallback
  },
  cardHeader: {
    backgroundColor: '#2A4E7A', // Azul do card na imagem
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  calendarIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  
  daysContainer: { flexDirection: 'row', gap: 4 },
  dayBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardActions: { flexDirection: 'row', alignItems: 'center' },
  
  // Radio Customizado
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5
  },
  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: '#FFF',
    borderRadius: 2
  },

  cardFooter: {
    backgroundColor: '#F5F6FA',
    padding: 12,
    alignItems: 'center'
  },
  footerText: { fontWeight: 'bold' }
});

export default RotinasScreen;