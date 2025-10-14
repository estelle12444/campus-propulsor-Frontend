import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  const { pathname } = request.nextUrl;

  // Routes protégées étudiant
  if (pathname.startsWith('/student') && !token) {
    return NextResponse.redirect(new URL('/connexion', request.url));
  }

  // Routes protégées admin
  if (pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/connexion', request.url));
  }

  // Si déjà connecté, rediriger du connexion/inscription vers le dashboard
  if ((pathname === '/connexion' || pathname === '/inscription') && token) {
    // Vérifier le rôle et rediriger vers le bon dashboard
    return NextResponse.redirect(new URL('/student/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/student/:path*',
    '/admin/:path*',
    '/connexion',
    '/inscription'
  ],
};