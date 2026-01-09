import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Text, IconButton, Button, TextInput, Checkbox } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';
import { treinoService } from '../services/treinoService';
import { api } from '../services/api';

const ExecucaoTreinoScreen = ({ navigation, route }) => {
  const { theme } = useAppTheme();
  const { treinoId } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [treino, setTreino] = useState(null);
  const [exercicios, setExercicios] = useState([]);
  const [finishing, setFinishing] = useState(false);
  
  // Estado para controlar quais accordions estão abertos
  const [expandedId, setExpandedId] = useState(null);

  // Estado para controlar exercícios concluídos (Check visual)
  const [completedExercises, setCompletedExercises] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Reutiliza a rota de detalhes do treino
      const data = await api.get(`/treinos/${treinoId}`);
      setTreino(data);
      
      // Prepara os dados dos exercícios para a UI de execução
      // Transforma o número de séries (ex: 3) em um array de objetos [{reps: 12, carga: 10}, ...]
      const formattedExercises = data.exercicios.map(ex => ({
          ...ex,
          seriesData: Array.from({ length: ex.series || 3 }, (_, i) => ({
              id: i,
              reps: ex.repeticoes?.toString() || '12',
              carga: ex.carga?.toString() || '0',
              concluido: false
          }))
      }));
      
      setExercicios(formattedExercises);
      
      // Abre o primeiro exercício automaticamente
      if (formattedExercises.length > 0) {
          setExpandedId(formattedExercises[0].id);
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar o treino.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  // Atualizar Carga/Reps de uma série específica
  const updateSerie = (exercicioIndex, serieIndex, field, value) => {
      const newExercicios = [...exercicios];
      newExercicios[exercicioIndex].seriesData[serieIndex][field] = value;
      setExercicios(newExercicios);
  };

  // Adicionar Nova Série
  const addSerie = (exercicioIndex) => {
      const newExercicios = [...exercicios];
      const ultimaSerie = newExercicios[exercicioIndex].seriesData[newExercicios[exercicioIndex].seriesData.length - 1];
      
      newExercicios[exercicioIndex].seriesData.push({
          id: Date.now(), // ID temporário
          reps: ultimaSerie?.reps || '12',
          carga: ultimaSerie?.carga || '0',
          concluido: false
      });
      setExercicios(newExercicios);
  };

  // Remover Série
  const removeSerie = (exercicioIndex, serieIndex) => {
      const newExercicios = [...exercicios];
      newExercicios[exercicioIndex].seriesData.splice(serieIndex, 1);
      setExercicios(newExercicios);
  };

  // Concluir Exercício Inteiro
  const toggleExerciseCompletion = (exercicioId) => {
      if (completedExercises.includes(exercicioId)) {
          setCompletedExercises(completedExercises.filter(id => id !== exercicioId));
      } else {
          setCompletedExercises([...completedExercises, exercicioId]);
          setExpandedId(null); // Fecha o accordion ao concluir
      }
  };

  const handleFinishWorkout = async () => {
      const totalExercicios = exercicios.length;
      const exerciciosConcluidos = completedExercises.length;
      const msg = exerciciosConcluidos === totalExercicios 
          ? `Você completou todos os ${totalExercicios} exercícios! Deseja finalizar o treino?`
          : `Você completou ${exerciciosConcluidos} de ${totalExercicios} exercícios. Tem certeza que deseja finalizar?`;
      
      Alert.alert("Finalizar Treino", msg, [
          { text: "Cancelar", style: "cancel" },
          { 
              text: "Finalizar", 
              onPress: async () => {
                  try {
                      setFinishing(true);
                      await treinoService.concluir(treino.id);
                      Alert.alert("Parabéns!", "Treino concluído com sucesso! 💪");
                      navigation.reset({
                          index: 0,
                          routes: [{ name: 'Dashboard' }],
                      });
                  } catch (error) {
                      Alert.alert("Erro", "Não foi possível finalizar o treino. Verifique sua conexão.");
                      console.error(error);
                  } finally {
                      setFinishing(false);
                  }
              } 
          }
      ]);
  };

  if (loading) {
      return (
        <View style={[styles.container, { justifyContent: 'center' }]}>
            <Text style={{ color: '#FFF' }}>Carregando treino...</Text>
        </View>
      );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton icon="arrow-left" iconColor="#FFF" size={24} onPress={() => navigation.goBack()} />
        <View style={{ alignItems: 'center' }}>
            <Text style={styles.headerTitle}>{treino?.nome}</Text>
            <View style={styles.tagsContainer}>
                <View style={styles.tag}><Text style={styles.tagText}>{route.params?.diaNome || 'Hoje'}</Text></View>
                {/* Categorias poderiam vir via params também se necessário */}
            </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {exercicios.map((item, index) => {
            const isExpanded = expandedId === item.id;
            const isCompleted = completedExercises.includes(item.id);

            return (
                <View key={item.id} style={styles.card}>
                    {/* Header do Card (Accordion) */}
                    <TouchableOpacity 
                        style={[styles.cardHeader, isExpanded && styles.cardHeaderExpanded, isCompleted && styles.cardHeaderCompleted]} 
                        onPress={() => toggleAccordion(item.id)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.exerciseName}>{item.nome}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {isCompleted && <IconButton icon="check-circle" iconColor="#4CAF50" size={20} />}
                            <IconButton 
                                icon={isExpanded ? "chevron-up" : "chevron-down"} 
                                iconColor="#FFF" 
                                size={24} 
                            />
                        </View>
                    </TouchableOpacity>

                    {/* Corpo do Card (Séries) */}
                    {isExpanded && (
                        <View style={styles.cardBody}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.colLabel}>Série</Text>
                                <Text style={styles.colLabel}>Repetições</Text>
                                <Text style={styles.colLabel}>Carga(kg)</Text>
                                <View style={{ width: 30 }} /> 
                            </View>

                            {item.seriesData.map((serie, sIndex) => (
                                <View key={sIndex} style={styles.serieRow}>
                                    <Text style={styles.serieNum}>{sIndex + 1}</Text>
                                    
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            value={serie.reps}
                                            onChangeText={(t) => updateSerie(index, sIndex, 'reps', t)}
                                            keyboardType="numeric"
                                            style={styles.input}
                                            dense
                                            underlineColor="transparent"
                                            activeUnderlineColor="transparent"
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            value={serie.carga}
                                            onChangeText={(t) => updateSerie(index, sIndex, 'carga', t)}
                                            keyboardType="numeric"
                                            style={styles.input}
                                            dense
                                            underlineColor="transparent"
                                            activeUnderlineColor="transparent"
                                        />
                                    </View>
                                    
                                    <TouchableOpacity onPress={() => removeSerie(index, sIndex)}>
                                        <IconButton icon="trash-can-outline" size={18} iconColor="#FF5252" />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            <View style={styles.actionsRow}>
                                <Button 
                                    mode="contained" 
                                    icon="plus" 
                                    onPress={() => addSerie(index)}
                                    style={styles.addSerieBtn}
                                    buttonColor="#587ba8"
                                    compact
                                >
                                    Adicionar Série
                                </Button>
                                
                                <Button 
                                    mode="contained" 
                                    onPress={() => toggleExerciseCompletion(item.id)}
                                    style={styles.concludeBtn}
                                    buttonColor={isCompleted ? "#4CAF50" : "#587ba8"}
                                    compact
                                >
                                    {isCompleted ? "Reabrir" : "Concluir"}
                                </Button>
                            </View>
                        </View>
                    )}
                    
                    {/* Resumo quando fechado */}
                    {!isExpanded && !isCompleted && (
                        <View style={styles.cardSummary}>
                            <Text style={{ color: '#103B66' }}>{item.seriesData.length} Séries • Carga média: {item.seriesData[0]?.carga}kg</Text>
                        </View>
                    )}
                     {!isExpanded && isCompleted && (
                        <View style={[styles.cardSummary, { backgroundColor: '#E8F5E9' }]}>
                             <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>Exercício Concluído!</Text>
                        </View>
                    )}
                </View>
            );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Button 
            mode="contained" 
            onPress={handleFinishWorkout}
            loading={finishing}
            disabled={finishing}
            style={styles.finishBtn}
            buttonColor="#102A45"
            contentStyle={{ height: 55 }}
        >
            Finalizar Treino
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#103B66' },
  header: { paddingTop: 40, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingBottom: 20 },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  tagsContainer: { flexDirection: 'row', gap: 5, marginTop: 5 },
  tag: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10 },
  tagText: { color: '#FFF', fontSize: 12 },

  scrollContent: { padding: 20, paddingBottom: 100, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: '#F5F6FA', minHeight: '100%' },

  // Card
  card: { backgroundColor: '#FFF', borderRadius: 15, marginBottom: 15, elevation: 2, overflow: 'hidden' },
  
  // Header do Accordion
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#587ba8' },
  cardHeaderExpanded: { borderBottomWidth: 1, borderBottomColor: '#EEE' },
  cardHeaderCompleted: { backgroundColor: '#102A45' }, // Fica mais escuro quando concluido
  exerciseName: { color: '#FFF', fontSize: 18, fontWeight: 'bold', flex: 1 },

  // Body
  cardBody: { padding: 15 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 10 },
  colLabel: { fontWeight: 'bold', color: '#666', fontSize: 12, flex: 1, textAlign: 'center' },

  serieRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  serieNum: { width: 30, textAlign: 'center', fontWeight: 'bold', color: '#103B66' },
  inputContainer: { flex: 1, marginHorizontal: 5 },
  input: { backgroundColor: '#EBEFF5', borderRadius: 20, height: 40, textAlign: 'center', fontSize: 14 },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  addSerieBtn: { flex: 1, marginRight: 10, borderRadius: 20 },
  concludeBtn: { flex: 1, marginLeft: 10, borderRadius: 20 },

  cardSummary: { padding: 15, alignItems: 'center', backgroundColor: '#FFF' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#F5F6FA', borderTopWidth: 1, borderTopColor: '#EEE' },
  finishBtn: { borderRadius: 30 },
});

export default ExecucaoTreinoScreen;