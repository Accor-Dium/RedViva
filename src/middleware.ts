
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;

  const isAdminPage = url.pathname.startsWith("/admin");
  const isLoggedIn = cookies.has("isLoggedIn");

  if (isAdminPage && !isLoggedIn) {
    return redirect("/login");
  }

  if (url.pathname === "/login" && isLoggedIn) {
    return redirect("/admin/dashboard");
  }

  return next();
});