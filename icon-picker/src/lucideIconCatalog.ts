// Icon name catalog for lucide-react, lazy-loaded so the ~1.8k icon modules
// never enter the main bundle. The value surface is the canonical kebab-case
// Lucide name (e.g. "arrow-up-right"); components resolve back to the PascalCase
// export through the module cache.

import type {LucideIcon} from 'lucide-react';
import {lucideIconNameByPascalCase} from './lucideIconNames.generated';

export interface LucideIconEntry {
  /** Canonical Lucide name in kebab-case, e.g. "arrow-up-right". */
  name: string;
  /** Name without separators, for dash-insensitive search. */
  searchKey: string;
  /** The lucide-react SVG component for this icon. */
  Icon: LucideIcon;
}

let catalogPromise: Promise<LucideIconEntry[]> | null = null;

const iconsByName = new Map<string, LucideIcon>();

/**
 * Loads every Lucide icon as a sorted catalog. The lucide-react barrel lives in
 * its own chunk and is fetched once; subsequent calls await the same result.
 */
export function loadLucideIconCatalog(): Promise<LucideIconEntry[]> {
  if (!catalogPromise) {
    catalogPromise = import('lucide-react').then(lucide => {
      const entries: LucideIconEntry[] = [];
      for (const [pascalName, Icon] of Object.entries(lucide.icons)) {
        const name = lucideIconNameByPascalCase[pascalName];
        if (!name) {
          continue;
        }
        entries.push({
          name,
          searchKey: name.replace(/-/g, ''),
          Icon,
        });
        iconsByName.set(name, Icon);
      }
      return entries.sort((a, b) => a.name.localeCompare(b.name));
    });
  }
  return catalogPromise;
}

/** Resolves a kebab-case icon name to its Lucide component, or null. */
export function getLucideIcon(name: string): LucideIcon | null {
  return iconsByName.get(name) ?? null;
}
