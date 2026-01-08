import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, Button, Avatar } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';
import BottomMenu from '../components/BottomMenu';

const RotinaDetailScreen = ({ navigation, route }) => {
  const { theme } = useAppTheme();
  const { rotinaData } = route.params || {};

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
       {/* Header Personalizado */}
       <View style={styles.header}>
        <View style={styles.headerTop}>
            {/* Espaço vazio para centralizar o ícone depois */}
            <View style={{ width: 40 }} /> 
            <Avatar.Icon size={80} icon="dumbbell" style={{ backgroundColor: '#00C2FF' }} />
            <View style={{ width: 40 }} />
        </View>
        
        {/* Nome da Rotina Dinâmico */}
        <Text variant="headlineSmall" style={styles.rotinaName}>
            {rotinaData?.nome || 'Nova Rotina'}
        </Text>

        <Button 
            mode="contained" 
            icon="plus" 
            style={styles.btnAdd}
            buttonColor="#FFF"
            textColor={theme.colors.primary}
            onPress={() => console.log('Adicionar dia')}
        >
            Adicionar dia de treino
        </Button>
      </View>

      {/* Conteúdo Branco */}
      <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
        
        <View style={styles.emptyState}>
            <Text style={{ color: theme.colors.primary, opacity: 0.7 }}>
                Adicione dias de treino a sua rotina
            </Text>
        </View>

        {/* Footer de Ação */}
        <View style={styles.actionFooter}>
            <Button mode="text" textColor={theme.colors.primary} onPress={() => navigation.goBack()}>
                Voltar
            </Button>
            
            <View style={styles.pagination}>
                <View style={[styles.dot, { backgroundColor: '#DDD' }]} />
                <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
            </View>

            <Button 
                mode="contained" 
                buttonColor={theme.colors.primary} 
                style={styles.btnSave}
                onPress={() => navigation.navigate('Dashboard')} // Por enquanto volta pra dashboard
            >
                Salvar
            </Button>
        </View>
      </View>
      
      <BottomMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: '35%', alignItems: 'center', justifyContent: 'center', paddingTop: 20 },
  headerTop: { flexDirection: 'row', width: '100%', justifyContent: 'center' },
  rotinaName: { color: '#FFF', fontWeight: 'bold', marginVertical: 15 },
  btnAdd: { borderRadius: 20, width: '70%' },

  contentContainer: { 
    flex: 1, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 24 
  },
  emptyState: { flex: 1, alignItems: 'center', paddingTop: 20 },
  
  actionFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  pagination: { flexDirection: 'row', gap: 8 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  btnSave: { borderRadius: 20, paddingHorizontal: 15 }
});

export default RotinaDetailScreen;