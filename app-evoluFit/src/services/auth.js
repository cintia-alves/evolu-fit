export const authService = {
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      console.log(`[API] Tentando login para: ${email}`);
      setTimeout(() => {
        if (password === '123456') {
          resolve({ token: 'fake-jwt-token', user: { name: 'Usuário Teste', email } });
        } else {
          reject(new Error('Credenciais inválidas'));
        }
      }, 1500);
    });
  },

  register: async (userData) => {
    return new Promise((resolve) => {
      console.log('[API] Dados recebidos para cadastro:', userData);
      setTimeout(() => {
        resolve({ success: true, message: 'Usuário criado com sucesso' });
      }, 1500);
    });
  }
};