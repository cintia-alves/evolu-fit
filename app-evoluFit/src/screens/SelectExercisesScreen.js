import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Text, IconButton, Button, Searchbar, Chip, ActivityIndicator } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';
import { exercicioService } from '../services/exercicioService';

const SelectExercisesScreen = ({ navigation, route }) => {
  const { theme } = useAppTheme();
  const { onSelect, initialSelected = [] } = route.params || {};

  const [allExercises, setAllExercises] = useState([]); // Todos os exercícios do banco
  const [displayedExercises, setDisplayedExercises] = useState([]); // Exercícios exibidos na lista (filtrados)
  
  const [selectedExercises, setSelectedExercises] = useState(initialSelected || []);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Filtro por Categoria ---
  const [grupos, setGrupos] = useState([]); // Lista de todas as categorias
  const [selectedGrupos, setSelectedGrupos] = useState([]); // Categorias ativas no filtro
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedGrupos, allExercises]);

  useEffect(() => {
    if (allExercises.length > 0 && selectedExercises.length > 0) {
        const needsUpdate = selectedExercises.some(ex => !ex.nome);
        if (needsUpdate) {
            setSelectedExercises(prev => prev.map(sel => {
                if (!sel.nome) {
                    const found = allExercises.find(ex => ex.id === sel.id);
                    return found ? found : sel;
                }
                return sel;
            }));
        }
    }
    applyFilters();
  }, [allExercises]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Carrega tudo de uma vez (ideal para listas pequenas/médias < 1000 itens)
      const [exerciciosData, gruposData] = await Promise.all([
        exercicioService.getAll(),
        exercicioService.getGrupos()
      ]);
      setAllExercises(exerciciosData);

      const uniqueGrupos = [...new Map((gruposData || []).map(item => [item.id, item])).values()];
      setGrupos(uniqueGrupos);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = allExercises || [];

    if (searchQuery) {
      result = result.filter(ex => 
        ex.nome.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setDisplayedExercises(result);
  };

  // Lógica de Seleção de Exercício (Toggle)
  const toggleExerciseSelection = (exercicio) => {
    setSelectedExercises(prev => {
      const exists = prev.find(e => e.id === exercicio.id);
      if (exists) {
        return prev.filter(e => e.id !== exercicio.id);
      } else {
        return [...prev, exercicio];
      }
    });
  };

  // Lógica de Seleção de Grupo (No Modal)
  const toggleGrupoSelection = (grupoId) => {
    setSelectedGrupos(prev => {
      if (prev.includes(grupoId)) {
        return prev.filter(id => id !== grupoId);
      } else {
        return [...prev, grupoId];
      }
    });
  };
  
  // Função especial para buscar exercícios dos grupos selecionados ao fechar o modal
  const handleConfirmFilter = async () => {
      setFilterModalVisible(false);
      setLoading(true);
      
      if (selectedGrupos.length === 0) {
          const all = await exercicioService.getAll();
          setAllExercises(all);
      } else {
          let filtered = [];
          // Busca em paralelo para ser mais rápido
          const promises = selectedGrupos.map(grupoId => exercicioService.getByGrupo(grupoId));
          const results = await Promise.all(promises);
          
          // Junta todos os arrays
          results.forEach(arr => {
              filtered = [...filtered, ...arr];
          });

          // Remove duplicatas de exercícios (caso um exercício tenha 2 categorias selecionadas)
          const uniqueExercises = [...new Map(filtered.map(item => [item.id, item])).values()];
          setAllExercises(uniqueExercises);
      }
      setLoading(false);
  };

  const handleSave = () => {
    if (onSelect) onSelect(selectedExercises);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: '#103B66' }]}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" iconColor="#FFF" size={24} onPress={() => navigation.goBack()} />
        <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Adicionar Exercícios</Text>
            <Text style={styles.headerSubtitle}>Selecione os exercícios que deseja</Text>
        </View>
        <IconButton 
            icon={selectedGrupos.length > 0 ? "filter" : "filter-outline"} 
            iconColor={selectedGrupos.length > 0 ? "#00C2FF" : "#FFF"} // Azul se tiver filtro ativo
            size={24} 
            onPress={() => setFilterModalVisible(true)}
        />
      </View>

      <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
        
        <Searchbar
            placeholder="Pesquisar"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={{ minHeight: 0 }}
        />

        {/* Chips dos Selecionados (Sem maxHeight para empurrar conteúdo) */}
        {(selectedExercises?.length ?? 0) > 0 && (
          <View style={styles.chipsWrapper}>
              {selectedExercises.map(ex => (
                  <Chip 
                      key={ex.id} 
                      onClose={() => toggleExerciseSelection(ex)} 
                      style={styles.chip}
                  >
                      <Text style={{ fontSize: 12 }}>
                          {(ex.nome || '').length > 18 
                            ? ex.nome.substring(0, 18) + "..." 
                            : (ex.nome || 'Sem Nome')}
                      </Text>
                  </Chip>
              ))}
          </View>
        )}

        {/* Lista de Exercícios (Item simples) */}
        <ScrollView contentContainerStyle={styles.listContainer}>
            {loading ? (
                <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 20 }} />
            ) : (
                displayedExercises.map(ex => {
                    const isSelected = selectedExercises?.find(s => s.id === ex.id);
                    return (
                        <TouchableOpacity 
                            key={ex.id} 
                            style={[styles.exerciseItem, isSelected && styles.exerciseItemActive]}
                            onPress={() => toggleExerciseSelection(ex)}
                        >
                            <Text style={[styles.exerciseText, isSelected && { color: '#103B66', fontWeight: 'bold' }]}>
                                {ex.nome}
                            </Text>
                            {isSelected ? (
                                <IconButton icon="check-circle" iconColor="#103B66" size={20} />
                            ) : (
                                <IconButton icon="plus-circle-outline" iconColor="#CCC" size={20} />
                            )}
                        </TouchableOpacity>
                    )
                })
            )}
            <View style={{ height: 60 }} />
        </ScrollView>

        <Button 
            mode="contained" 
            style={styles.saveBtn} 
            buttonColor="#103B66"
            onPress={handleSave}
        >
            Salvar ({selectedExercises?.length || 0})
        </Button>
      </View>

      {/* --- MODAL DE FILTRO (CATEGORIAS) --- */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Filtrar por Categoria</Text>
                    <IconButton icon="close" size={20} onPress={() => setFilterModalVisible(false)} />
                </View>
                
                <ScrollView contentContainerStyle={styles.gruposGrid}>
                    {grupos.map(grupo => {
                        const isSelected = selectedGrupos.includes(grupo.id);
                        return (
                            <TouchableOpacity 
                                key={grupo.id} 
                                style={[styles.grupoButton, isSelected && styles.grupoButtonActive]}
                                onPress={() => toggleGrupoSelection(grupo.id)}
                            >
                                <Text style={[styles.grupoText, isSelected && { color: '#FFF' }]}>
                                    {grupo.nome}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
                
                <View style={styles.modalFooter}>
                    <Button 
                        mode="text" 
                        textColor="#666"
                        onPress={() => {
                            setSelectedGrupos([]); // Limpar filtros
                            // handleConfirmFilter será chamado manualmente ou via useEffect se preferir
                            // Aqui vamos apenas limpar o state visual
                        }}
                    >
                        Limpar
                    </Button>
                    <Button mode="contained" onPress={handleConfirmFilter} buttonColor="#103B66">
                        Aplicar Filtros
                    </Button>
                </View>
            </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 40, paddingBottom: 20, paddingHorizontal: 10 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  headerSubtitle: { color: '#B0C4DE', fontSize: 12 },
  
  contentContainer: { flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 },
  searchBar: { borderRadius: 30, backgroundColor: '#EBEFF5', marginBottom: 15, height: 45 },
  
  chipsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
  chip: { backgroundColor: '#DCE6F2' },

  listContainer: { paddingBottom: 80 },
  
  // Item de Exercício (Lista Principal)
  exerciseItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 5
  },
  exerciseItemActive: { backgroundColor: '#E3F2FD', borderColor: '#103B66', borderWidth: 1 },
  exerciseText: { fontSize: 16, color: '#333' },

  saveBtn: { borderRadius: 25, position: 'absolute', bottom: 30, left: 20, right: 20 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#103B66' },
  
  gruposGrid: { padding: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  grupoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF'
  },
  grupoButtonActive: { backgroundColor: '#103B66', borderColor: '#103B66' },
  grupoText: { color: '#666' },

  modalFooter: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderTopWidth: 1, borderTopColor: '#EEE' }
});

export default SelectExercisesScreen;