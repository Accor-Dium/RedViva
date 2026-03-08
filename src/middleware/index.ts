import { defineMiddleware, sequence } from "astro:middleware";

// 1. Validación de origen (reemplaza checkOrigin)
const originCheck = defineMiddleware(async ({ request }, next) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const origin = request.headers.get('origin');
    const ALLOWED_ORIGINS = [
      'https://www.red-viva.org',
      'https://red-viva.org',
    ];

    if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
      return new Response(
          JSON.stringify({ error: 'Forbidden' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  return next();
});

// 2. Autenticación de admin (tu middleware existente)
const authCheck = defineMiddleware(async ({ url, cookies, redirect }, next) => {
  const isPathAdmin = url.pathname.startsWith("/admin");
  const isLoginPage = url.pathname === "/admin/login";
  const isLoggedIn = cookies.has("isLoggedIn");

  if (isPathAdmin && !isLoginPage && !isLoggedIn) {
    return redirect("/admin/login");
  }
  if (isLoginPage && isLoggedIn) {
    return redirect("/admin/dashboard");
  }

  return next();
});

// Se ejecutan en orden: primero origin, luego auth
export const onRequest = sequence(originCheck, authCheck);