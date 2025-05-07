'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setAuthToken } from '@/utils/authUtils'; // Import the utility

export default function AuthForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (password: any) => {
    let score = 0;
    let feedback = [];
    
    // Check length
    if (password.length < 8) {
      feedback.push("Au moins 8 caractères");
    } else {
      score += 1;
    }
    
    // Check for lowercase
    if (!/[a-z]/.test(password)) {
      feedback.push("Au moins une minuscule");
    } else {
      score += 1;
    }
    
    // Check for uppercase
    if (!/[A-Z]/.test(password)) {
      feedback.push("Au moins une majuscule");
    } else {
      score += 1;
    }
    
    // Check for numbers
    if (!/[0-9]/.test(password)) {
      feedback.push("Au moins un chiffre");
    } else {
      score += 1;
    }
    
    // Check for special characters
    if (!/[^a-zA-Z0-9]/.test(password)) {
      feedback.push("Au moins un caractère spécial");
    } else {
      score += 1;
    }
    
    // Return strength level
    if (score < 3) return { strength: "Faible", feedback };
    if (score < 5) return { strength: "Moyen", feedback };
    return { strength: "Fort", feedback: [] };
  };
  const handlePasswordChange = (e: any) => {
    const password = e.target.value;
    const result = validatePassword(password);
    setPasswordStrength(result.strength);
    setPasswordError(result.feedback.join(', '));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, isRegister: boolean) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Client-side validation for registration
    if (isRegister) {
      const password = data.password as string;
      const confirmPassword = data.confirmPassword as string;

      if (password !== confirmPassword) {
        toast.error('Les mots de passe ne correspondent pas.');
        setIsLoading(false);
        return;
      }
    }

    // Prepare payload for API request
    const payload = {
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
      email: data.email,
      password: data.password,
      role: isRegister ? role : undefined,
    };

    try {
      const endpoint = isRegister
        ? 'http://localhost:3001/auth/register' // Registration endpoint
        : 'http://localhost:3001/auth/login'; // Login endpoint

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch');
      }

      const responseData = await response.json();

      // Store the authentication token using the utility function
      if (responseData.token) {
        // Cas connexion : token reçu
        setAuthToken(responseData.token);
        toast.success('Connexion réussie !');
        router.push('/');
      } else if (isRegister && responseData.message) {
        // Cas inscription sans token : message d’attente admin
        toast.success(responseData.message);
        router.push('/home'); // ou une page “Merci” si tu préfères
      } else {
        toast.error('Problème d\'authentification. Veuillez réessayer.');
      }
      
      

      toast.success(isRegister ? 'Inscription réussie !' : 'Connexion réussie !');
      router.push(isRegister ? '/profil' : '/');

    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="login" className="">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Connexion</TabsTrigger>
        <TabsTrigger value="register">Inscription</TabsTrigger>
      </TabsList>
      <div className="relative pt-4 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"/>
      <div className="relative pt-4 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"/>

      <TabsContent value="login">
        <form className="space-y-6" onSubmit={(e) => handleSubmit(e, false)}>
          <div>
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              disabled={isLoading}
              className="mt-1"
            />
          </div>
          <div>
            <div className="flex items-center">
              <Label htmlFor="password">Mot de passe</Label>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                Forgot your password?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLoading}
                className="mt-1 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Chargement...' : 'Se connecter'}
            </Button>
          </div>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline underline-offset-4">
                Sign up
            </a>
          </div>
        </form>
      </TabsContent>
      <TabsContent value="register">
        <form className="space-y-6" onSubmit={(e) => handleSubmit(e, true)}>
          <div>
            <Label htmlFor="name">Nom complet</Label>
            <div className='flex items-center gap-4'>
            <Input
              id="nom"
              name="nom"
              type="text"
              required
              disabled={isLoading}
              className="mt-1"
              placeholder='Nom'
            />
            <Input
              id="prenom"
              name="prenom"
              type="text"
              required
              disabled={isLoading}
              className="mt-1"
              placeholder='Prénom'
            />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Numéro de téléphone</Label>
            <Input
              id="telephone"
              name="telephone"
              type="text"
              required
              disabled={isLoading}
              className="mt-1"
              placeholder='+212612345678'
            />
          </div>
          <div>
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              disabled={isLoading}
              className="mt-1"
              placeholder='nom@exemple.com'
            />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLoading}
                className="mt-1 pr-10"
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {passwordStrength && (
              <div className="mt-1">
                <div className="flex items-center gap-2">
                  <span style={{color: "#"}}>Force: </span>
                  <span className={`font-medium ${
                    passwordStrength === 'Fort' ? 'text-green-500' : 
                    passwordStrength === 'Moyen' ? 'text-yellow-500' : 
                    'text-red-500'
                  }`}>
                    {passwordStrength}
                  </span>
                </div>
                {passwordError && <p className="text-sm text-red-400 mt-1">{passwordError}</p>}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLoading}
                className="mt-1 pr-10"
                onChange={(e) => {
                  const password = document.getElementById('password').value;
                  if (e.target.value && e.target.value !== password) {
                    e.target.setCustomValidity("Les mots de passe ne correspondent pas");
                  } else {
                    e.target.setCustomValidity("");
                  }
                }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div>
            {/* <Label htmlFor="role">Votre Rôle</Label> */}
            <Select onValueChange={(value) => setRole(value)} required>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ETUDIANT">Etudiant</SelectItem>
                <SelectItem value="PROFESSEUR">Professeur</SelectItem>
                <SelectItem value="DIPLOME">Diplômé</SelectItem>
              </SelectContent>
            </Select>
          </div>  
          <div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Chargement...' : "S'inscrire"}
            </Button>
          </div>
        </form>
      </TabsContent>
    </Tabs>
  );
}