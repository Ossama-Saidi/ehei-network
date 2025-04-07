// Layout pour les pages d'authentification
// Ce layout est utilisé uniquement pour les pages d'authentification (login, register, etc.).
// src/app/(auth)/layout.tsx
export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        {children}
      </div>
    );
  }