/**
 * Property-based test for component migration completeness
 * **Feature: nextjs-migration, Property 6: Component Migration Completeness**
 * **Validates: Requirements 4.1**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { existsSync, readdirSync, statSync } from 'fs';
import { join, relative, extname } from 'path';

// Define the component directories to check
const COMPONENT_DIRECTORIES = [
  'components/blocks',
  'components/custom', 
  'components/retroui',
  'components/ui'
];

// Get all component files from a directory recursively
function getAllComponentFiles(baseDir: string, componentDir: string): string[] {
  const fullPath = join(baseDir, 'src', componentDir);
  
  if (!existsSync(fullPath)) {
    return [];
  }
  
  const files: string[] = [];
  
  function walkDirectory(dir: string): void {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const itemPath = join(dir, item);
      const stat = statSync(itemPath);
      
      if (stat.isDirectory()) {
        walkDirectory(itemPath);
      } else if (stat.isFile()) {
        const ext = extname(item);
        if (['.tsx', '.ts', '.jsx', '.js'].includes(ext)) {
          // Get relative path from the base component directory
          const relativePath = relative(join(baseDir, 'src'), itemPath);
          files.push(relativePath);
        }
      }
    }
  }
  
  walkDirectory(fullPath);
  return files;
}

// Get all component files from TanStack Start app
function getAllTanstackComponents(): string[] {
  const tanstackBaseDir = join(process.cwd(), '..', 'client');
  const allComponents: string[] = [];
  
  for (const componentDir of COMPONENT_DIRECTORIES) {
    const components = getAllComponentFiles(tanstackBaseDir, componentDir);
    allComponents.push(...components);
  }
  
  return allComponents;
}

// Get all component files from Next.js app
func