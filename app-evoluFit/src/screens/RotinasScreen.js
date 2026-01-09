import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Avatar, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { rotinaService } from '../services/rotinaService';
import { api } from '../services/api';
import BottomMenu from '../components/BottomMenu';

const RotinasScreen = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rotinas, setRotinas] = useState([]);

  const weekLetters = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const fetchRotinas = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userRotinas = await rotinaService.getByUser(user.id);
      const rotinasComDetalhes = await Promise.all(
        userRotinas.map(async (rotina) => {
          try {
            const detalhes = await api.get(`/rotinas/${rotina.id}`);
            return detalhes; 
          } catch (e) {
            return { ...rotina, treinos: [] };
          }
        })
      );
      setRotinas(rotinasComDetalhes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRotinas();
    }, [user])
  );

  const handleDelete = (id) => {
    console.log("Tentando excluir Rotina ID:", id); // Log para debug
    Alert.alert(
      "Excluir Rotina",
      "Tem certeza que deseja deletar esta rotina?",
      [
        { text: "Não", style: "cancel" },
        { 
          text: "Sim", 
          onPress: async () => {
            try {
              setLoading(true); // Mostra loading durante a exclusão
              await rotinaService.delete(id); // Aguarda a deleção
              console.log("Rotina excluída com sucesso!");
              await fetchRotinas(); // Recarrega a lista atualizada
            } catch (error) {
              console.error("Erro ao excluir rotina:", error);
              Alert.alert("Erro", "Não foi possível excluir a rotina. Tente novamente.");
            } finally {
              setLoading(false);
            }
          } 
        }
      ]
    );
  };

  const WeekDaysBadges = ({ treinos }) => {
    const activeDays = new Set();
    if (treinos) {
      treinos.forEach(t => activeDays.add(t.dia_semana)); // Agora usa dia_semana direto (0-6)
    }

    return (
      <View style={styles.daysContainer}>
        {weekLetters.map((letter, index) => {
          const isActive = activeDays.has(index);
          return (
            <View key={index} style={[styles.dayBadge, { backgroundColor: isActive ? '#A0B4D6' : 'rgba(255,255,255,0.2)' }]}> 
              <Text style={{ fontSize: 10, color: '#FFF', fontWeight: 'bold' }}>{letter}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#103B66' }]}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <IconButton icon="arrow-left" iconColor="#FFF" size={24} onPress={() => navigation.navigate('Dashboard')} />
          <View style={styles.iconHeader}>
              <Text variant="headlineSmall" style={styles.headerTitle}>Rotinas</Text>
          </View>
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

      <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
        {loading ? (
            <ActivityIndicator animating={true} color={theme.colors.primary} style={{ marginTop: 50 }} />
        ) : (
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {rotinas.map((rotina) => (
                    <TouchableOpacity 
                        key={rotina.id} 
                        style={styles.card}
                        onPress={() => navigation.navigate('RotinaDetail', { rotinaData: rotina })}
                    >
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
                            <TouchableOpacity onPress={() => handleDelete(rotina.id)}>
                                <IconButton icon="delete-outline" iconColor="#FFF" size={20} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.cardFooter}>
                            <Text style={[styles.footerText, { color: theme.colors.primary }]}>Ver Treinos</Text>
                        </View>
                    </TouchableOpacity>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 40, paddingHorizontal: 10 },
  iconHeader: { alignItems: 'center' },
  headerTitle: { color: '#FFF', fontWeight: 'bold' },
  addButtonContainer: { alignItems: 'center', marginBottom: 20 },
  addButton: { borderRadius: 25, width: '60%' },
  contentContainer: { flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 30, paddingHorizontal: 20 },
  scrollContent: { paddingBottom: 80 },
  card: { borderRadius: 20, overflow: 'hidden', marginBottom: 20, elevation: 3, backgroundColor: '#FFF' },
  cardHeader: { backgroundColor: '#2A4E7A', padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  calendarIcon: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, width: 45, height: 45, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  daysContainer: { flexDirection: 'row', gap: 4 },
  dayBadge: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  cardFooter: { backgroundColor: '#F5F6FA', padding: 12, alignItems: 'center' },
  footerText: { fontWeight: 'bold' }
});

export default RotinasScreen;