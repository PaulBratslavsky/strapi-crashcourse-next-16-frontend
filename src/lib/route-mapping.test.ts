/**
 * Property-based test for route conversion completeness
 * **Feature: nextjs-migration, Property 1: Route Conversion Completeness**
 * **Validates: Requirements 2.1**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { existsSync } from 'fs';
import { join } from 'path';
import { 
  ROUTE_MAPPINGS, 
  getExpectedNextjsPath, 
  getAllTanstackRoutes,
  getAllExpectedNextjsRoutes 
} from './route-mapping';

describe('Route Conversion Completeness', () => {
  it('Property 1: For any route that exists in TanStack Start, there should be a corresponding Next.js page component', () => {
    // **Feature: nextjs-migration, Property 1: Route Conversion Completeness**
    // **Validates: Requirements 2.1**
    
    fc.assert(
      fc.property(
        fc.constantFrom(...getAllTanstackRoutes()),
        (tanstackRoute) => {
          // Get the expected Next.js file path for this TanStack route
          const expectedNextjsPath = getExpectedNextjsPath(tanstackRoute);
          
          // The mapping should exist
          expect(expectedNextjsPath).not.toBeNull();
          
          if (expectedNextjsPath) {
            // The Next.js file should exist in the file system
            const fullPath = join(process.cwd(), expectedNextjsPath);
            const fileExists = existsSync(fullPath);
            
            // Property: Every TanStack route must have a corresponding Next.js page component
            expect(fileExists).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 1 (Completeness Check): All expected Next.js route files should exist', () => {
    // **Feature: nextjs-migration, Property 1: Route Conversion Completeness**
    // **Validates: Requirements 2.1**
    
    // Test that all expected Next.js route files exist
    const allExpectedRoutes = getAllExpectedNextjsRoutes();
    
    for (const expectedRoute of allExpectedRoutes) {
      const fullPath = join(process.cwd(), expectedRoute);
      const fileExists = existsSync(fullPath);
      
      expect(fileExists).toBe(true);
    }
  });

  it('Property 1 (Route Mapping Integrity): Route mappings should be well-formed', () => {
    // **Feature: nextjs-migration, Property 1: Route Conversion Completeness**
    // **Validates: Requirements 2.1**
    
    fc.assert(
      fc.property(
        fc.constantFrom(...ROUTE_MAPPINGS),
        (mapping) => {
          // Each mapping should have valid properties
          expect(mapping.tanstackRoute).toBeTruthy();
          expect(mapping.nextjsRoute).toBeTruthy();
          expect(typeof mapping.isDynamic).toBe('boolean');
          
          // TanStack routes should start with /
          expect(mapping.tanstackRoute.startsWith('/')).toBe(true);
          
          // Next.js routes should end with .tsx or .ts
          expect(mapping.nextjsRoute.endsWith('.tsx') || mapping.nextjsRoute.endsWith('.ts')).toBe(true);
          
          // Dynamic routes should be properly identified
          const hasDynamicSegment = mapping.tanstackRoute.includes('$') || mapping.nextjsRoute.includes('[');
          if (mapping.isDynamic) {
            expect(hasDynamicSegment).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});