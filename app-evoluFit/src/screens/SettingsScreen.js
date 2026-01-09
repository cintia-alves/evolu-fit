import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { Text, Avatar, Switch, IconButton, Button, TextInput } from 'react-native-paper';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth';
import CustomInput from '../components/CustomInput'; // Usando seu componente padrão

const SettingsItem = ({ label, icon, isSwitch, value, onToggle, onPress, theme }) => (
  <TouchableOpacity 
    style={[styles.item, { backgroundColor: theme.colors.surfaceVariant }]} 
    onPress={isSwitch ? onToggle : onPress}
    disabled={isSwitch}
  >
    <Text style={[styles.itemLabel, { color: theme.dark ? '#FFF' : '#333' }]}>{label}</Text>
    {isSwitch ? (
      <Switch value={value} onValueChange={onToggle} color={theme.colors.primary} />
    ) : (
      <IconButton icon="arrow-right" size={20} iconColor={theme.colors.secondaryText} />
    )}
  </TouchableOpacity>
);

const SettingsScreen = ({ navigation }) => {
  const { isDark, toggleTheme, theme } = useAppTheme();
  const { user, signOut, updateUser } = useAuth();

  // Estados dos Modais
  const [modalProfileVisible, setModalProfileVisible] = useState(false);
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);

  // Estados dos Formulários
  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    signOut();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const handleSaveProfile = async () => {
    if (!nome || !email) {
        Alert.alert("Erro", "Preencha todos os campos.");
        return;
    }
    setLoading(true);
    try {
        const response = await authService.updateProfile(user.id, { nome, email });
        updateUser(response.usuario); // Atualiza contexto
        setModalProfileVisible(false);
        Alert.alert("Sucesso", "Perfil atualizado!");
    } catch (error) {
        Alert.alert("Erro", "Falha ao atualizar perfil.");
    } finally {
        setLoading(false);
    }
  };

  const handleSavePassword = async () => {
      if (!novaSenha || !confirmarSenha) {
          Alert.alert("Erro", "Preencha os campos.");
          return;
      }
      if (novaSenha !== confirmarSenha) {
          Alert.alert("Erro", "As senhas não coincidem.");
          return;
      }
      setLoading(true);
      try {
          await authService.updatePassword(user.id, novaSenha);
          setModalPasswordVisible(false);
          setNovaSenha('');
          setConfirmarSenha('');
          Alert.alert("Sucesso", "Senha alterada com sucesso!");
      } catch (error) {
          Alert.alert("Erro", "Falha ao alterar senha.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#103B66' }]}> 
      <View style={styles.header}>
        <IconButton style={{ alignSelf: 'flex-start' }} icon="arrow-left" iconColor="#FFF" size={28} onPress={() => navigation.goBack()} />
        <View style={styles.profileContainer}>
          <Avatar.Icon size={80} icon="account" style={{ backgroundColor: '#00C2FF' }} />
          <Text variant="headlineMedium" style={styles.name}>
            {user?.nome || 'Usuário'}
          </Text>
        </View>
      </View>

      <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <SettingsItem 
            label="Editar Perfil" 
            theme={theme} 
            onPress={() => {
                setNome(user?.nome || '');
                setEmail(user?.email || '');
                setModalProfileVisible(true);
            }} 
           />
          
          <SettingsItem 
            label="Alterar Senha" 
            theme={theme} 
            onPress={() => setModalPasswordVisible(true)} 
          />
          
          <SettingsItem 
            label="Notificação" 
            isSwitch 
            value={true} 
            onToggle={() => {}} 
            theme={theme} 
          />
          
          <SettingsItem 
            label="Modo escuro" 
            isSwitch 
            value={isDark} 
            onToggle={toggleTheme} 
            theme={theme} 
          />

          <SettingsItem label="Excluir Conta" theme={theme} onPress={() => Alert.alert("Aviso", "Funcionalidade em breve.")} />

          <Button 
            mode="contained" 
            onPress={handleLogout}
            style={styles.logoutButton}
            buttonColor="#103B66"
            textColor="#FFF"
            contentStyle={{ height: 50 }}
          >
            Sair da conta
          </Button>

        </ScrollView>
        <View style={{ height: 60 }} /> 
      </View>

      {/* --- MODAL EDITAR PERFIL --- */}
      <Modal
        visible={modalProfileVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalProfileVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Editar Perfil</Text>
                </View>
                <View style={styles.modalBody}>
                    <CustomInput 
                        label="Nome" 
                        value={nome} 
                        onChangeText={setNome} 
                        style={{ backgroundColor: '#F2F4F8' }}
                    />
                    <CustomInput 
                        label="E-mail" 
                        value={email} 
                        onChangeText={setEmail} 
                        keyboardType="email-address"
                        style={{ backgroundColor: '#F2F4F8' }}
                    />

                    <View style={styles.modalFooter}>
                        <Button mode="outlined" style={styles.modalBtnCancel} textColor="#666" onPress={() => setModalProfileVisible(false)}>
                            Cancelar
                        </Button>
                        <Button mode="contained" loading={loading} style={styles.modalBtnSave} buttonColor="#103B66" onPress={handleSaveProfile}>
                            Salvar
                        </Button>
                    </View>
                </View>
            </View>
        </View>
      </Modal>

      {/* --- MODAL ALTERAR SENHA --- */}
      <Modal
        visible={modalPasswordVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalPasswordVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Alterar Senha</Text>
                </View>
                <View style={styles.modalBody}>
                    <CustomInput 
                        label="Nova Senha" 
                        value={novaSenha} 
                        onChangeText={setNovaSenha} 
                        secureTextEntry
                        style={{ backgroundColor: '#F2F4F8' }}
                    />
                    <CustomInput 
                        label="Confirmar Senha" 
                        value={confirmarSenha} 
                        onChangeText={setConfirmarSenha} 
                        secureTextEntry
                        style={{ backgroundColor: '#F2F4F8' }}
                    />

                    <View style={styles.modalFooter}>
                        <Button mode="outlined" style={styles.modalBtnCancel} textColor="#666" onPress={() => setModalPasswordVisible(false)}>
                            Cancelar
                        </Button>
                        <Button mode="contained" loading={loading} style={styles.modalBtnSave} buttonColor="#103B66" onPress={handleSavePassword}>
                            Salvar
                        </Button>
                    </View>
                </View>
            </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 250,
    paddingTop: 40,
    marginBottom: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'column'
  },
  profileContainer: { alignItems: 'center', marginTop: 10 },
  name: { color: '#FFF', fontWeight: 'bold', marginTop: 10 },
  
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  scrollContent: { paddingBottom: 20 },
  
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginBottom: 16,
    height: 60,
  },
  itemLabel: { fontWeight: '600', fontSize: 16 },
  
  logoutButton: {
    borderRadius: 30,
    marginTop: 20,
  },

  // Modal Styles (Reaproveitando o estilo padrão que usamos nas outras telas)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 20, overflow: 'hidden', elevation: 5 },
  modalHeader: { backgroundColor: '#103B66', padding: 20, alignItems: 'center' },
  modalTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  modalBody: { padding: 20 },
  modalFooter: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 10 },
  modalBtnCancel: { flex: 1, borderColor: '#DDD', borderWidth: 1 },
  modalBtnSave: { flex: 1 },
});

export default SettingsScreen;