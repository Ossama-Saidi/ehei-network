// src/app/(auth)/login/page.tsx
// Page de connexion (login)

import AuthForm from '@/components/AuthForm';

export default function LoginPage() {

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
          <h2 className="mt-4 font-klavika font-bold italic text-center text-2xl bg-gradient-to-r from-stone-600 to-stone-900 bg-clip-text text-transparent">
          Bienvenue sur Notre communaité
          </h2>
          <a href="#" className="flex items-center gap-2 self-center text-3xl font-klavika font-bold italic bg-gradient-to-r from-stone-600 to-stone-900 bg-clip-text text-transparent">
          EHEI-Connect.
        </a>
        <AuthForm />
        <div className="relative pt-4 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"/>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
      </div>
    </div>
  );
}