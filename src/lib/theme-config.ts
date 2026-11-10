export interface ThemeColors {
  primary: string;
  primaryRgb: string;
  accent: string;
  accentRgb: string;
  background: string;
  backgroundRgb: string;
  card: string;
  cardBorder: string;
  glow: string;
  text: string;
  textMuted: string;
  selectionBg: string;
  selectionText: string;
}

export interface WebsiteThemeItem {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  description: string;
  category: 'Cyber Matrix' | 'Sci-Fi Blue' | 'Hardware Gaming' | 'Warm Luxury' | 'Synthwave' | 'Minimalist' | 'Oceanic Aqua' | 'Tokyo Dusk';
  isDefault?: boolean;
  colors: ThemeColors;
  preview: {
    badgeClass: string;
    accentGradient: string;
    dotClass: string;
    chipBg: string;
    chipBorder: string;
    chipText: string;
  };
}

export const WEBSITE_THEMES: WebsiteThemeItem[] = [
  {
    id: 'emerald',
    name: 'Cyber Emerald',
    tagline: 'Deep Obsidian Matrix & Cyber Mint',
    badge: 'Current Default',
    isDefault: true,
    description: 'The signature ACCNO SOLUTION aesthetic: deep obsidian black canvas with neon cyber emerald and mint highlights, engineered for high-tech precision.',
    category: 'Cyber Matrix',
    colors: {
      primary: '#5ED29C',
      primaryRgb: '94, 210, 156',
      accent: '#16FFC6',
      accentRgb: '22, 255, 198',
      background: '#070B0A',
      backgroundRgb: '7, 11, 10',
      card: '#0E1714',
      cardBorder: 'rgba(94, 210, 156, 0.2)',
      glow: 'rgba(22, 255, 198, 0.35)',
      text: '#FFFFFF',
      textMuted: 'rgba(255, 255, 255, 0.65)',
      selectionBg: '#5ED29C',
      selectionText: '#070B0A',
    },
    preview: {
      badgeClass: 'bg-[#16FFC6]/20 text-[#16FFC6] border-[#16FFC6]/30',
      accentGradient: 'from-[#070B0A] via-[#0E1714] to-[#16FFC6]',
      dotClass: 'bg-[#16FFC6]',
      chipBg: 'bg-[#16FFC6]/10',
      chipBorder: 'border-[#16FFC6]/30',
      chipText: 'text-[#16FFC6]',
    },
  },
  {
    id: 'electric-indigo',
    name: 'Electric Indigo',
    tagline: 'Deep Space Navy & Neon Cyan',
    badge: 'Cyber Sapphire',
    description: 'Cosmic deep space navy background illuminated by piercing electric indigo and neon cyan accents. Inspired by enterprise cloud infrastructure.',
    category: 'Sci-Fi Blue',
    colors: {
      primary: '#6366F1',
      primaryRgb: '99, 102, 241',
      accent: '#38BDF8',
      accentRgb: '56, 189, 248',
      background: '#060814',
      backgroundRgb: '6, 8, 20',
      card: '#0C1026',
      cardBorder: 'rgba(99, 102, 241, 0.25)',
      glow: 'rgba(56, 189, 248, 0.35)',
      text: '#FFFFFF',
      textMuted: 'rgba(255, 255, 255, 0.65)',
      selectionBg: '#6366F1',
      selectionText: '#FFFFFF',
    },
    preview: {
      badgeClass: 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/30',
      accentGradient: 'from-[#060814] via-[#0C1026] to-[#38BDF8]',
      dotClass: 'bg-[#38BDF8]',
      chipBg: 'bg-[#38BDF8]/10',
      chipBorder: 'border-[#38BDF8]/30',
      chipText: 'text-[#38BDF8]',
    },
  },
  {
    id: 'crimson-apex',
    name: 'Crimson Apex',
    tagline: 'Dark Carbon & Aggressive Scarlet Flame',
    badge: 'Hyper Red',
    description: 'Pitch-dark carbon chassis accented with vivid crimson scarlet and hyper-coral energy. Built for extreme overclocking and gaming hardware gear.',
    category: 'Hardware Gaming',
    colors: {
      primary: '#EF4444',
      primaryRgb: '239, 68, 68',
      accent: '#FF3366',
      accentRgb: '255, 51, 102',
      background: '#0D0608',
      backgroundRgb: '13, 6, 8',
      card: '#1A0A0F',
      cardBorder: 'rgba(239, 68, 68, 0.25)',
      glow: 'rgba(255, 51, 102, 0.35)',
      text: '#FFFFFF',
      textMuted: 'rgba(255, 255, 255, 0.65)',
      selectionBg: '#FF3366',
      selectionText: '#FFFFFF',
    },
    preview: {
      badgeClass: 'bg-[#FF3366]/20 text-[#FF3366] border-[#FF3366]/30',
      accentGradient: 'from-[#0D0608] via-[#1A0A0F] to-[#FF3366]',
      dotClass: 'bg-[#FF3366]',
      chipBg: 'bg-[#FF3366]/10',
      chipBorder: 'border-[#FF3366]/30',
      chipText: 'text-[#FF3366]',
    },
  },
  {
    id: 'solar-amber',
    name: 'Solar Amber',
    tagline: 'Warm Espresso & Radiant Cyber Gold',
    badge: 'Gold Flux',
    description: 'Warm dark espresso onyx canvas infused with rich cyber amber and metallic liquid gold. Radiates premium corporate prestige, warmth, and luxury.',
    category: 'Warm Luxury',
    colors: {
      primary: '#F59E0B',
      primaryRgb: '245, 158, 11',
      accent: '#FBBF24',
      accentRgb: '251, 191, 36',
      background: '#0C0A05',
      backgroundRgb: '12, 10, 5',
      card: '#1A1408',
      cardBorder: 'rgba(245, 158, 11, 0.25)',
      glow: 'rgba(251, 191, 36, 0.35)',
      text: '#FFFFFF',
      textMuted: 'rgba(255, 255, 255, 0.65)',
      selectionBg: '#F59E0B',
      selectionText: '#0C0A05',
    },
    preview: {
      badgeClass: 'bg-[#FBBF24]/20 text-[#FBBF24] border-[#FBBF24]/30',
      accentGradient: 'from-[#0C0A05] via-[#1A1408] to-[#FBBF24]',
      dotClass: 'bg-[#FBBF24]',
      chipBg: 'bg-[#FBBF24]/10',
      chipBorder: 'border-[#FBBF24]/30',
      chipText: 'text-[#FBBF24]',
    },
  },
  {
    id: 'ultra-violet',
    name: 'Ultra Violet',
    tagline: 'Midnight Cosmic & Luminous Lilac',
    badge: 'Neon Synthwave',
    description: 'Abyssal dark cosmos background radiating with vivid ultraviolet and neon electric lilac luminescence. Bold, futuristic, and creatively inspiring.',
    category: 'Synthwave',
    colors: {
      primary: '#A855F7',
      primaryRgb: '168, 85, 247',
      accent: '#C084FC',
      accentRgb: '192, 132, 252',
      background: '#090514',
      backgroundRgb: '9, 5, 20',
      card: '#140A26',
      cardBorder: 'rgba(168, 85, 247, 0.25)',
      glow: 'rgba(192, 132, 252, 0.35)',
      text: '#FFFFFF',
      textMuted: 'rgba(255, 255, 255, 0.65)',
      selectionBg: '#A855F7',
      selectionText: '#FFFFFF',
    },
    preview: {
      badgeClass: 'bg-[#C084FC]/20 text-[#C084FC] border-[#C084FC]/30',
      accentGradient: 'from-[#090514] via-[#140A26] to-[#C084FC]',
      dotClass: 'bg-[#C084FC]',
      chipBg: 'bg-[#C084FC]/10',
      chipBorder: 'border-[#C084FC]/30',
      chipText: 'text-[#C084FC]',
    },
  },
  {
    id: 'titanium-frost',
    name: 'Titanium Frost',
    tagline: 'Zero Saturation & Platinum Ice Slate',
    badge: 'Monochrome Minimal',
    description: 'Ultra-clean zero-saturation dark titanium with pristine icy silver and platinum highlights. Offers the crispest readability and distraction-free clarity.',
    category: 'Minimalist',
    colors: {
      primary: '#94A3B8',
      primaryRgb: '148, 163, 184',
      accent: '#F1F5F9',
      accentRgb: '241, 245, 249',
      background: '#090A0F',
      backgroundRgb: '9, 10, 15',
      card: '#12151D',
      cardBorder: 'rgba(148, 163, 184, 0.25)',
      glow: 'rgba(241, 245, 249, 0.30)',
      text: '#FFFFFF',
      textMuted: 'rgba(255, 255, 255, 0.65)',
      selectionBg: '#F1F5F9',
      selectionText: '#090A0F',
    },
    preview: {
      badgeClass: 'bg-[#F1F5F9]/20 text-[#F1F5F9] border-[#F1F5F9]/30',
      accentGradient: 'from-[#090A0F] via-[#12151D] to-[#F1F5F9]',
      dotClass: 'bg-[#F1F5F9]',
      chipBg: 'bg-[#F1F5F9]/10',
      chipBorder: 'border-[#F1F5F9]/30',
      chipText: 'text-[#F1F5F9]',
    },
  },
  {
    id: 'oceanic-teal',
    name: 'Oceanic Teal',
    tagline: 'Mariana Abyssal & Electric Turquoise',
    badge: 'Deep Aqua',
    description: 'Abyssal deep marine navy paired with electric turquoise and glowing tropical aqua. Cooling, refreshing, and remarkably easy on prolonged eye focus.',
    category: 'Oceanic Aqua',
    colors: {
      primary: '#0D9488',
      primaryRgb: '13, 148, 136',
      accent: '#06B6D4',
      accentRgb: '6, 182, 212',
      background: '#040E14',
      backgroundRgb: '4, 14, 20',
      card: '#071C26',
      cardBorder: 'rgba(13, 148, 136, 0.25)',
      glow: 'rgba(6, 182, 212, 0.35)',
      text: '#FFFFFF',
      textMuted: 'rgba(255, 255, 255, 0.65)',
      selectionBg: '#06B6D4',
      selectionText: '#040E14',
    },
    preview: {
      badgeClass: 'bg-[#06B6D4]/20 text-[#06B6D4] border-[#06B6D4]/30',
      accentGradient: 'from-[#040E14] via-[#071C26] to-[#06B6D4]',
      dotClass: 'bg-[#06B6D4]',
      chipBg: 'bg-[#06B6D4]/10',
      chipBorder: 'border-[#06B6D4]/30',
      chipText: 'text-[#06B6D4]',
    },
  },
  {
    id: 'sunset-coral',
    name: 'Sunset Coral',
    tagline: 'Twilight Charcoal & Radiant Peach Sunset',
    badge: 'Tokyo Neon',
    description: 'Velvety dark twilight charcoal highlighted with warm tangerine dusk and glowing Tokyo neon coral. Sophisticated, energetic, and visually stunning.',
    category: 'Tokyo Dusk',
    colors: {
      primary: '#F97316',
      primaryRgb: '249, 115, 22',
      accent: '#FB7185',
      accentRgb: '251, 113, 133',
      background: '#0F080A',
      backgroundRgb: '15, 8, 10',
      card: '#1F1014',
      cardBorder: 'rgba(249, 115, 22, 0.25)',
      glow: 'rgba(251, 113, 133, 0.35)',
      text: '#FFFFFF',
      textMuted: 'rgba(255, 255, 255, 0.65)',
      selectionBg: '#FB7185',
      selectionText: '#0F080A',
    },
    preview: {
      badgeClass: 'bg-[#FB7185]/20 text-[#FB7185] border-[#FB7185]/30',
      accentGradient: 'from-[#0F080A] via-[#1F1014] to-[#FB7185]',
      dotClass: 'bg-[#FB7185]',
      chipBg: 'bg-[#FB7185]/10',
      chipBorder: 'border-[#FB7185]/30',
      chipText: 'text-[#FB7185]',
    },
  },
];

export function getThemeById(id: string): WebsiteThemeItem {
  return WEBSITE_THEMES.find((t) => t.id === id) || WEBSITE_THEMES[0];
}

export function applyThemeToDocument(themeId: string): void {
  if (typeof document === 'undefined') return;
  const validTheme = WEBSITE_THEMES.some((t) => t.id === themeId) ? themeId : 'emerald';
  document.documentElement.setAttribute('data-theme', validTheme);
  try {
    const raw = localStorage.getItem('accno_website_theme');
    let current = { activeTheme: validTheme, glowIntensity: 'vibrant', cardGlassmorphism: true, contrastMode: 'standard', updatedAt: new Date().toISOString() };
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed === 'object' && parsed !== null) {
          current = { ...parsed, activeTheme: validTheme, updatedAt: new Date().toISOString() };
        }
      } catch {}
    }
    localStorage.setItem('accno_website_theme', JSON.stringify(current));
  } catch {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('accno-theme-changed', { detail: { theme: validTheme } }));
  }
}

export function getStoredThemeId(): string {
  if (typeof window === 'undefined') return 'emerald';
  try {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr && WEBSITE_THEMES.some((t) => t.id === attr)) return attr;
    const raw = localStorage.getItem('accno_website_theme');
    if (raw) {
      const parsed = JSON.parse(raw);
      const id = typeof parsed === 'string' ? parsed : parsed?.activeTheme;
      if (id && WEBSITE_THEMES.some((t) => t.id === id)) return id;
    }
  } catch {}
  return 'emerald';
}
