/*Pour empêcher les utilisateurs non connectés d'accéder à la page d'accueil, 
faut utiliser un middleware ou une logique côté serveur.*/


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value; // Vérifie si un token existe

  const isAuthRoute = req.nextUrl.pathname.startsWith("/login"); // Page login
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/app"); // Pages protégées

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirige vers login
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/app", req.url)); // Redirige vers home si déjà connecté
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login"], // Appliquer le middleware à ces routes
};