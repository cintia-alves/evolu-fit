import React, { createContext, useState, useContext } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email, senha) => {
    setLoading(true);
    try {
      const response = await authService.login(email, senha);
      if (response.usuario) {
        console.log("Response:", response)
        setUser(response.usuario);
        return response.usuario;
      } else {
        throw new Error("Erro ao obter dados do usuário");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      
      if (response && response.usuario) {
          console.log("Auto-login após cadastro:", response.usuario);
          setUser(response.usuario); // Define o usuário no estado global
      }

      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
  };

  const updateUser = (updatedUser) => {
      setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);