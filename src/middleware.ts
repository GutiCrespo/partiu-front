import { NextRequest, NextResponse } from "next/server"

const protectRoutes = new Set([

  // Abaixo, adicionar as rotas que são privadas:
  '/trips',
])

const redirectRoute = '/signin'

const isAuthPage = (path: string) => path === "/signin" || path === "/login"

const isProtectedPath = (path: string) => {
  for (const base of protectRoutes) {
    if (path === base) return true

    // protege subrotas: /trips/..., /trips/123, /trips/abc/xyz
    if (base !== '/' && path.startsWith(base + "/")) return true
  }
  return false
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const search = request.nextUrl.search
  const token = request.cookies.get('authToken')?.value

  console.log(`O path é: ${path}`);

  if (token && isAuthPage(path)) {
    console.log(
      "Usuário autenticado tentando acessar rota pública de autenticação. Redirecionando para home"
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  const routeIsProtected = isProtectedPath(path);

  if (routeIsProtected) {
    console.log(`O path ${path} é uma rota protegida`);
    if (!token) {
      console.log(
        `Usuário não autenticado tentando acessar ${path}. Redirecionando para ${redirectRoute}.`
      )
      const url = new URL(redirectRoute, request.url);
      url.searchParams.set("next", path + search);
      return NextResponse.redirect(url);
    }
  } else {
    console.log(
      `O path ${path} é uma rota PÚBLICA (ou não requer autenticação).`
    );
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
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};