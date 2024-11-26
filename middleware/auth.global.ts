// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth();

  // List of public pages that don't require authentication
  const publicPages = ['/login', '/forgot-password'];
  const isPublicPage = publicPages.includes(to.path);
  

  if (isPublicPage && !user.value) {
    return; // Allow access to public pages for unauthenticated users
  }

  if (!user.value && !isPublicPage) {
    // Redirect to login if trying to access a protected page
    return navigateTo('/login');
  }

  if (user.value && isPublicPage) {
    // Redirect to dashboard if logged-in user tries to access public pages
    return navigateTo('/dashboard');
  }

  if (user.value && to.path === '/') {
    // Redirect to dashboard if logged-in user accesses the root path
    return navigateTo('/dashboard');
  }
});