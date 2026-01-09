import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Text, IconButton, Button, Avatar, Switch, TextInput as RNTextInput } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native'; // Importante
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { rotinaService } from '../services/rotinaService';
import { treinoService } from '../services/treinoService';
import { api } from '../services/api';
import BottomMenu from '../components/BottomMenu';
import CustomInput from '../components/CustomInput';

const RotinaDetailScreen = ({ navigation, route }) => {
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const { rotinaData } = route.params || {};

  const [rotina, setRotina] = useState(rotinaData);
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRotinasUser, setTotalRotinasUser] = useState(0);
  
  // Modals States
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTreino, setEditingTreino] = useState(null);
  const [treinoNome, setTreinoNome] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [editRotinaModalVisible, setEditRotinaModalVisible] = useState(false);
  const [tempRotinaName, setTempRotinaName] = useState('');

  const weekLetters = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const fullDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  // Carregar dados (usar useFocusEffect para recarregar ao voltar da seleção de exercicios)
  const loadData = async () => {
    if(!rotina?.id) return;
    setLoading(true);
    try {
      const updatedRotina = await api.get(`/rotinas/${rotina.id}`);
      setRotina(updatedRotina);
      setTreinos(updatedRotina.treinos || []);
      const allRotinas = await rotinaService.getByUser(user.id);
      setTotalRotinasUser(allRotinas.length);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
        loadData();
    }, [rotinaData])
  );

  const handleToggleActive = async (value) => {
    if (value) {
        try {
            await rotinaService.ativar(rotina.id, user.id);
            setRotina({ ...rotina, ativa: 1 });
            Alert.alert("Sucesso", "Esta rotina agora é a principal.");
        } catch (error) { Alert.alert("Erro", "Falha ao ativar."); }
    } else {
        Alert.alert("Aviso", "Ative outra rotina para desativar esta.");
    }
  };

  // --- CRUD Rotina Nome ---
  const handleUpdateRotinaName = async () => {
      if (!tempRotinaName.trim()) return;
      try {
          await rotinaService.update(rotina.id, tempRotinaName);
          setRotina({ ...rotina, nome: tempRotinaName });
          setEditRotinaModalVisible(false);
      } catch (error) { Alert.alert("Erro", "Falha ao atualizar."); }
  };

  // --- CRUD Treino (Dia) ---
  const openModal = (treino = null) => {
    if (treino) {
        setEditingTreino(treino);
        setTreinoNome(treino.nome);
        setSelectedDay(treino.dia_semana);
    } else {
        setEditingTreino(null);
        setTreinoNome('');
        setSelectedDay(null);
    }
    setModalVisible(true);
  };

  const handleSaveTreino = async () => {
    if (!treinoNome || selectedDay === null) {
        Alert.alert("Atenção", "Preencha tudo.");
        return;
    }
    try {
        if (editingTreino) {
            await treinoService.update(editingTreino.id, { nome: treinoNome, dia_semana: selectedDay });
        } else {
            await treinoService.create({ nome: treinoNome, dia_semana: selectedDay, rotina_id: rotina.id });
        }
        setModalVisible(false);
        loadData();
    } catch (error) { Alert.alert("Erro", "Falha ao salvar."); }
  };

  const handleDeleteTreino = (id) => {
    Alert.alert("Excluir", "Remover dia?", [
        { text: "Não" },
        { text: "Sim", onPress: async () => { await treinoService.delete(id); loadData(); }}
    ]);
  };

  // --- Navegação para Seleção de Exercícios ---
const handleEditExercises = (treino) => {
    // Agora o backend retorna 'exercicios' (lista de objetos), não apenas IDs.
    // Passamos essa lista completa para a tela de seleção, assim os Chips já terão nomes.
    const currentSelected = treino.exercicios || []; 
    
    navigation.navigate('SelectExercises', { 
        initialSelected: currentSelected, 
        onSelect: async (selectedExercisesList) => {
            try {
                const ids = selectedExercisesList.map(e => e.id);
                await treinoService.updateExercises(treino.id, ids);
                // Recarrega os dados imediatamente para atualizar as badges e contadores
                loadData();
            } catch (e) {
                Alert.alert("Erro", "Falha ao salvar exercícios");
            }
        }
    });
};

  return (
    <View style={[styles.container, { backgroundColor: '#103B66' }]}>
       <View style={styles.header}>
        <IconButton icon="arrow-left" iconColor="#FFF" size={24} onPress={() => navigation.goBack()} />
        <View style={styles.headerIconContainer}>
            <View style={styles.titleRow}>
                <Text variant="headlineSmall" style={styles.rotinaName}>{rotina?.nome}</Text>
                <IconButton icon="pencil" iconColor="#FFF" size={18} onPress={() => { setTempRotinaName(rotina.nome); setEditRotinaModalVisible(true); }} />
            </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.actionsContainer}>
        {(totalRotinasUser > 1 || rotina?.ativa === 1) && (
            <View style={styles.toggleContainer}>
                <Text style={styles.toggleLabel}>Exibir na Dashboard</Text>
                <Switch value={rotina?.ativa === 1} onValueChange={handleToggleActive} color="#00C2FF"/>
            </View>
        )}
      </View>

      <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
        <Button mode="contained" icon="plus" style={styles.btnAdd} buttonColor="#FFF" textColor='#103B66' onPress={() => openModal()}>
            Adicionar dia de treino
        </Button>
        
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>            
            {treinos.map((item) => (
                <View key={item.id} style={styles.treinoCard}>
                    <View style={styles.cardHeader}>
                        <View style={styles.dateIcon}>
                            <IconButton icon="calendar-blank" iconColor="#FFF" size={24} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.cardTitle}>{item.nome}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.dayTag}>
                                    <Text style={styles.dayTagText}>{fullDays[item.dia_semana]}</Text>
                                </View>
                                {/* Exibe os grupos musculares REAIS vindos do backend */}
                                {item.grupos && item.grupos.map((grupo, idx) => (
                                    <View key={idx} style={[styles.dayTag, { backgroundColor: '#87CEFA', marginLeft: 5 }]}>
                                        <Text style={styles.dayTagText}>{grupo}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                             <IconButton icon="pencil" iconColor="#FFF" size={18} onPress={() => openModal(item)} />
                             <IconButton icon="delete" iconColor="#FFF" size={18} onPress={() => handleDeleteTreino(item.id)} />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.cardFooter} onPress={() => handleEditExercises(item)}>
                        {/* Exibe contagem REAL */}
                        <Text style={styles.exercisesText}>
                            {item.total_exercicios > 0 ? `${item.total_exercicios} Exercícios` : 'Adicionar Exercícios'}
                        </Text>
                        <IconButton icon="arrow-right" size={20} iconColor="#103B66" />
                    </TouchableOpacity>
                </View>
            ))}
            
            {treinos && treinos.length === 0 && !loading && (
                <Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>Nenhum dia de treino cadastrado.</Text>
            )}
        </ScrollView>

        <View style={styles.footerButtons}>
            <Button mode="contained" buttonColor="#103B66" style={{ borderRadius: 20, width: '100%' }} onPress={() => navigation.goBack()}>
                Salvar e Voltar
            </Button>
        </View>
      </View>
      
      {/* Modal Criar/Editar Treino */}
      <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{editingTreino ? 'Editar Dia' : 'Novo Dia de Treino'}</Text>
                </View>
                <View style={styles.modalBody}>
                    <CustomInput label="Nome" placeholder='Ex: "Treino A"' value={treinoNome} onChangeText={setTreinoNome} style={{ backgroundColor: '#F2F4F8' }} />
                    <Text style={styles.inputLabel}>Selecione o dia da semana</Text>
                    <View style={styles.daysSelector}>
                        {weekLetters.map((letter, index) => (
                            <TouchableOpacity key={index} style={[styles.daySelectBtn, selectedDay === index && styles.daySelectBtnActive]} onPress={() => setSelectedDay(index)}>
                                <Text style={[styles.daySelectText, selectedDay === index && { color: '#FFF' }]}>{letter}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.modalFooter}>
                        <Button mode="outlined" style={styles.modalBtnCancel} textColor="#666" onPress={() => setModalVisible(false)}>Cancelar</Button>
                        <Button mode="contained" style={styles.modalBtnSave} buttonColor="#103B66" onPress={handleSaveTreino}>Salvar</Button>
                    </View>
                </View>
            </View>
        </View>
      </Modal>

      {/* Modal Editar Nome Rotina */}
      <Modal visible={editRotinaModalVisible} transparent={true} animationType="fade" onRequestClose={() => setEditRotinaModalVisible(false)}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                     <Text style={styles.modalTitle}>Editar Rotina</Text>
                </View>
                <View style={styles.modalBody}>
                    <CustomInput label="Nome da Rotina" value={tempRotinaName} onChangeText={setTempRotinaName} style={{ backgroundColor: '#F2F4F8' }} />
                    <View style={styles.modalFooter}>
                        <Button mode="outlined" style={styles.modalBtnCancel} textColor="#666" onPress={() => setEditRotinaModalVisible(false)}>Cancelar</Button>
                        <Button mode="contained" style={styles.modalBtnSave} buttonColor="#103B66" onPress={handleUpdateRotinaName}>Salvar</Button>
                    </View>
                </View>
            </View>
        </View>
      </Modal>

      <BottomMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 40, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
  headerIconContainer: { alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  rotinaName: { color: '#FFF', fontWeight: 'bold' },
  actionsContainer: { alignItems: 'center', marginBottom: 20 },
  btnAdd: { borderRadius: 25, width: '100%', marginBottom: 15 },
  toggleContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 },
  toggleLabel: { color: '#FFF', marginRight: 10, fontSize: 12 },
  contentContainer: { flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24 },
  listTitle: { color: '#103B66', fontWeight: 'bold', marginBottom: 10, marginTop: 5 },
  
  // Card Novo
  treinoCard: { borderRadius: 20, overflow: 'hidden', marginBottom: 15, elevation: 3, backgroundColor: '#FFF' },
  cardHeader: { backgroundColor: '#103B66', padding: 15, flexDirection: 'row', alignItems: 'flex-start' },
  dateIcon: { backgroundColor: '#87CEFA', borderRadius: 12, width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 18, marginBottom: 5 },
  dayTag: { backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  dayTagText: { color: '#FFF', fontSize: 12 },
  cardFooter: { backgroundColor: '#F5F6FA', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  exercisesText: { color: '#103B66', fontWeight: 'bold', fontSize: 16, marginRight: 10 },

  footerButtons: { marginTop: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', elevation: 5 },
  modalHeader: { backgroundColor: '#587ba8', padding: 20, alignItems: 'center' },
  modalTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  modalBody: { padding: 20 },
  inputLabel: { color: '#103B66', fontWeight: 'bold', marginBottom: 8, marginTop: 10 },
  daysSelector: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  daySelectBtn: { width: 35, height: 35, borderRadius: 10, borderWidth: 1, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
  daySelectBtnActive: { backgroundColor: '#587ba8', borderColor: '#587ba8' },
  daySelectText: { color: '#666', fontWeight: 'bold' },
  modalFooter: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  modalBtnCancel: { flex: 1, borderColor: '#DDD', borderWidth: 1 },
  modalBtnSave: { flex: 1 },
});

export default RotinaDetailScreen;