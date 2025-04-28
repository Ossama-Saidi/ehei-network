// publication-service/src/users/user.interface.ts
export interface User {
    id: number;
    email: string;
    nom: string;
    prenom: string;
    role: string;
    nomComplet?: string; // We'll compute this from nom and prenom
  }