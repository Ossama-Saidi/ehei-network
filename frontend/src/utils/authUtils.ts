/*Pour empêcher les utilisateurs non connectés d'accéder à la page d'accueil, 
faut utiliser un middleware ou une logique côté serveur.*/


// Utility functions for handling authentication tokens
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};