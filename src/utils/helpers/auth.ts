import { redirect } from 'next/navigation';

/**
 * Server-side authentication check
 * Use this in Server Components or Server Actions
 */
export async function requireAuth() {
  // This will be handled by middleware, but you can add additional checks here
  // For example, checking user permissions, roles, etc.
  return true;
}

/**
 * Redirect to signin with return URL
 */
export function redirectToSignin(returnUrl?: string) {
  const signinUrl = '/signin';
  if (returnUrl) {
    redirect(`${signinUrl}?redirect=${encodeURIComponent(returnUrl)}`);
  }
  redirect(signinUrl);
}

/**
 * Check if a route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  const publicRoutes = ['/signin', '/signup', '/api/auth'];
  return !publicRoutes.some((route) => pathname.startsWith(route));
}
