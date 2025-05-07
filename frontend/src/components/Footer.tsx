// src/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-white py-8">
      <div className="container mx-auto text-center">
        <p className="mb-4">
          &copy; {new Date().getFullYear()} EHEI Connect. Tous droits réservés.
        </p>
        <div className="space-x-4">
          <Link href="/about" className="hover:text-gray-400">
            À propos
          </Link>
          <Link href="/contact" className="hover:text-gray-400">
            Contact
          </Link>
          <Link href="/terms" className="hover:text-gray-400">
            Conditions d'utilisation
          </Link>
          <Link href="/privacy" className="hover:text-gray-400">
            Politique de confidentialité
          </Link>
        </div>
      </div>
    </footer>
  );
}