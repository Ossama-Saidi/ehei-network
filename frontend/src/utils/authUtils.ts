// src/utils/authUtils.ts
import { jwtDecode } from 'jwt-decode';

export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Fonction utilitaire pour ajouter le token aux en-têtes des requêtes
export const authHeader = () => {
  const token = getAuthToken();
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

export interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  nomComplet: string;
  iat?: number;
  exp?: number;
}

export const getDecodedToken = (): DecodedToken | null => {
  const token = getAuthToken();
  if (token) {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Invalid token format:', error);
      return null;
    }
  }
  return null;
};