import { NextRequest, NextResponse } from "next/server"

const protectRoutes = new Set([
  '/404', // coloquei isso aqui apenas pra que o "path" fosse lido

  // Abaixo, adicionar as rotas que são realmente privadas:
  '/trips',
])

const redirectRoute = '/signin'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const token = request.cookies.get('authToken')?.value
  const routeIsProtected = protectRoutes.has(path)

  console.log(`O path é: ${path}`);

  if (routeIsProtected) {
    console.log(`O path ${path} é uma rota PROTEGIDA.`);
    if (!token) {
      console.log(`Usuário não autenticado tentando acessar ${path}. Redirecionando para ${redirectRoute}.`);
      return NextResponse.redirect(new URL(redirectRoute, request.url));
    }
  } else {
    console.log(`O path ${path} é uma rota PÚBLICA (ou não requer autenticação).`);
    if (token && (path === '/signin' || path === '/login')) {
      console.log('Usuário autenticado tentando acessar rota pública de autenticação. Redirecionando para home');
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

