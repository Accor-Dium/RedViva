/* import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;

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
}); */