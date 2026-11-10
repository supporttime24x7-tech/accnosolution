'use client';

import { useEffect } from 'react';
import { useErpStore } from '@/lib/store';
import { applyThemeToDocument, getStoredThemeId } from '@/lib/theme-config';

export function ThemeInitializer() {
  const websiteTheme = useErpStore((state) => state.websiteTheme);

  // Initial sync on mount
  useEffect(() => {
    const initialId = websiteTheme?.activeTheme || getStoredThemeId();
    applyThemeToDocument(initialId);

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: string; mode?: string }>;
      if (customEvent.detail?.theme) {
        applyThemeToDocument(customEvent.detail.theme);
      }
    };

    window.addEventListener('accno-theme-changed', handleCustomChange);
    return () => window.removeEventListener('accno-theme-changed', handleCustomChange);
  }, []);

  // Reactive sync when store updates
  useEffect(() => {
    if (websiteTheme?.activeTheme) {
      applyThemeToDocument(websiteTheme.activeTheme);
    }
  }, [websiteTheme?.activeTheme]);

  return null;
}
