/**
 * Route mapping utilities for testing route conversion completeness
 */

export interface RouteMapping {
  tanstackRoute: string;
  nextjsRoute: string;
  isDynamic: boolean;
}

/**
 * Complete mapping of TanStack Start routes to Next.js App Router routes
 */
export const ROUTE_MAPPINGS: RouteMapping[] = [
  // Root route
  { tanstackRoute: '/', nextjsRoute: '/page.tsx', isDynamic: false },
  
  // Articles routes
  { tanstackRoute: '/articles', nextjsRoute: '/articles/page.tsx', isDynamic: false },
  { tanstackRoute: '/articles/$slug', nextjsRoute: '/articles/[slug]/page.tsx', isDynamic: true },
  
  // Courses routes
  { tanstackRoute: '/courses', nextjsRoute: '/courses/page.tsx', isDynamic: false },
  { tanstackRoute: '/courses/$slug', nextjsRoute: '/courses/[slug]/page.tsx', isDynamic: true },
  
  // Auth routes
  { tanstackRoute: '/_auth/signin', nextjsRoute: '/auth/signin/page.tsx', isDynamic: false },
  { tanstackRoute: '/_auth/signup', nextjsRoute: '/auth/signup/page.tsx', isDynamic: false },
  
  // Dynamic page route
  { tanstackRoute: '/$slug', nextjsRoute: '/[slug]/page.tsx', isDynamic: true },
  
  // API routes (converted to API routes in Next.js)
  { tanstackRoute: '/api/connect/$provider', nextjsRoute: '/api/connect/[provider]/route.ts', isDynamic: true },
  { tanstackRoute: '/api/connect/$provider/redirect', nextjsRoute: '/api/connect/[provider]/redirect/route.ts', isDynamic: true },
];

/**
 * Get expected Next.js file path for a TanStack route
 */
export function getExpectedNextjsPath(tanstackRoute: string): string | null {
  const mapping = ROUTE_MAPPINGS.find(m => m.tanstackRoute === tanstackRoute);
  return mapping ? `src/app${mapping.nextjsRoute}` : null;
}

/**
 * Get all TanStack routes that should have Next.js equivalents
 */
export function getAllTanstackRoutes(): string[] {
  return ROUTE_MAPPINGS.map(m => m.tanstackRoute);
}

/**
 * Get all expected Next.js route files
 */
export function getAllExpectedNextjsRoutes(): string[] {
  return ROUTE_MAPPINGS.map(m => `src/app${m.nextjsRoute}`);
}

/**
 * Check if a route is dynamic (contains parameters)
 */
export function isDynamicRoute(tanstackRoute: string): boolean {
  const mapping = ROUTE_MAPPINGS.find(m => m.tanstackRoute === tanstackRoute);
  return mapping?.isDynamic ?? false;
}