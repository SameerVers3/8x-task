export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  font: string;
  fontWeights: string;
  colors: {
    background: string;
    backgroundElevated: string;
    backgroundGlass: string;
    foreground: string;
    foregroundMuted: string;
    foregroundSubtle: string;
    accent: string;
    accentHover: string;
    accentMuted: string;
    border: string;
    borderSubtle: string;
    danger: string;
    success: string;
    warning: string;
    surface: string;
    surfaceHover: string;
  };
  radius: string;
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    glow: string;
  };
}

export const themePresets: ThemePreset[] = [
  {
    id: "midnight",
    name: "Midnight",
    description: "Dark, elegant, glassmorphism",
    font: "Inter",
    fontWeights: "300;400;500;600;700",
    colors: {
      background: "#0a0a0f",
      backgroundElevated: "#111118",
      backgroundGlass: "rgba(255,255,255,0.04)",
      foreground: "#f0f0f5",
      foregroundMuted: "#a0a0b0",
      foregroundSubtle: "#5a5a6a",
      accent: "#7c3aed",
      accentHover: "#8b5cf6",
      accentMuted: "rgba(124,58,237,0.15)",
      border: "rgba(255,255,255,0.08)",
      borderSubtle: "rgba(255,255,255,0.04)",
      danger: "#ef4444",
      success: "#22c55e",
      warning: "#f59e0b",
      surface: "#14141f",
      surfaceHover: "#1a1a2a",
    },
    radius: "0.75rem",
    shadows: {
      sm: "0 1px 2px rgba(0,0,0,0.3)",
      md: "0 4px 12px rgba(0,0,0,0.4)",
      lg: "0 8px 24px rgba(0,0,0,0.5)",
      xl: "0 16px 48px rgba(0,0,0,0.6)",
      glow: "0 0 20px rgba(124,58,237,0.3)",
    },
  },
  {
    id: "solarized-dark",
    name: "Solarized Dark",
    description: "Classic solarized dark palette",
    font: "JetBrains Mono",
    fontWeights: "400;500;700",
    colors: {
      background: "#002b36",
      backgroundElevated: "#073642",
      backgroundGlass: "rgba(0,43,54,0.7)",
      foreground: "#eee8d5",
      foregroundMuted: "#93a1a1",
      foregroundSubtle: "#586e75",
      accent: "#b58900",
      accentHover: "#cb4b16",
      accentMuted: "rgba(181,137,0,0.15)",
      border: "rgba(238,232,213,0.08)",
      borderSubtle: "rgba(238,232,213,0.04)",
      danger: "#dc322f",
      success: "#859900",
      warning: "#b58900",
      surface: "#083642",
      surfaceHover: "#0e4a5c",
    },
    radius: "0.5rem",
    shadows: {
      sm: "0 1px 2px rgba(0,0,0,0.3)",
      md: "0 4px 12px rgba(0,0,0,0.4)",
      lg: "0 8px 24px rgba(0,0,0,0.5)",
      xl: "0 16px 48px rgba(0,0,0,0.6)",
      glow: "0 0 20px rgba(181,137,0,0.3)",
    },
  },
  {
    id: "solarized-light",
    name: "Solarized Light",
    description: "Classic solarized light palette",
    font: "JetBrains Mono",
    fontWeights: "400;500;700",
    colors: {
      background: "#fdf6e3",
      backgroundElevated: "#eee8d5",
      backgroundGlass: "rgba(253,246,227,0.7)",
      foreground: "#073642",
      foregroundMuted: "#586e75",
      foregroundSubtle: "#93a1a1",
      accent: "#b58900",
      accentHover: "#cb4b16",
      accentMuted: "rgba(181,137,0,0.12)",
      border: "rgba(7,54,66,0.08)",
      borderSubtle: "rgba(7,54,66,0.04)",
      danger: "#dc322f",
      success: "#859900",
      warning: "#b58900",
      surface: "#f5efdc",
      surfaceHover: "#e8e2cf",
    },
    radius: "0.5rem",
    shadows: {
      sm: "0 1px 2px rgba(0,0,0,0.06)",
      md: "0 4px 12px rgba(0,0,0,0.08)",
      lg: "0 8px 24px rgba(0,0,0,0.1)",
      xl: "0 16px 48px rgba(0,0,0,0.12)",
      glow: "0 0 20px rgba(181,137,0,0.2)",
    },
  },
  {
    id: "cyber-neon",
    name: "Cyber Neon",
    description: "Neon on dark, cyberpunk vibes",
    font: "Space Grotesk",
    fontWeights: "300;400;500;600;700",
    colors: {
      background: "#050505",
      backgroundElevated: "#0a0a0a",
      backgroundGlass: "rgba(255,255,255,0.03)",
      foreground: "#e0e0e0",
      foregroundMuted: "#888888",
      foregroundSubtle: "#444444",
      accent: "#00f0ff",
      accentHover: "#33f5ff",
      accentMuted: "rgba(0,240,255,0.12)",
      border: "rgba(0,240,255,0.15)",
      borderSubtle: "rgba(0,240,255,0.08)",
      danger: "#ff0055",
      success: "#00ff88",
      warning: "#ffcc00",
      surface: "#0c0c0c",
      surfaceHover: "#111111",
    },
    radius: "0.25rem",
    shadows: {
      sm: "0 1px 2px rgba(0,0,0,0.5)",
      md: "0 0 12px rgba(0,240,255,0.15)",
      lg: "0 0 24px rgba(0,240,255,0.2)",
      xl: "0 0 48px rgba(0,240,255,0.25)",
      glow: "0 0 30px rgba(0,240,255,0.4)",
    },
  },
  {
    id: "retro-wave",
    name: "Retro Wave",
    description: "80s synthwave, sunset vibes",
    font: "VT323",
    fontWeights: "400",
    colors: {
      background: "#0f0c29",
      backgroundElevated: "#1a1650",
      backgroundGlass: "rgba(15,12,41,0.7)",
      foreground: "#ff71ce",
      foregroundMuted: "#b967ff",
      foregroundSubtle: "#7a5cff",
      accent: "#ff0055",
      accentHover: "#ff3377",
      accentMuted: "rgba(255,0,85,0.15)",
      border: "rgba(255,113,206,0.2)",
      borderSubtle: "rgba(255,113,206,0.1)",
      danger: "#ff0055",
      success: "#05ffa1",
      warning: "#ffcc00",
      surface: "#1a1550",
      surfaceHover: "#251f6e",
    },
    radius: "0px",
    shadows: {
      sm: "0 1px 2px rgba(0,0,0,0.5)",
      md: "0 0 12px rgba(255,0,85,0.2)",
      lg: "0 0 24px rgba(255,0,85,0.3)",
      xl: "0 0 48px rgba(255,0,85,0.4)",
      glow: "0 0 40px rgba(255,0,85,0.5)",
    },
  },
  {
    id: "anime-dreams",
    name: "Anime Dreams",
    description: "Pastel, manga-inspired, soft",
    font: "Nunito",
    fontWeights: "300;400;500;600;700;800",
    colors: {
      background: "#faf5ff",
      backgroundElevated: "#f3e8ff",
      backgroundGlass: "rgba(250,245,255,0.7)",
      foreground: "#4a1d6a",
      foregroundMuted: "#7c5a9c",
      foregroundSubtle: "#a88ec4",
      accent: "#ff6b9d",
      accentHover: "#ff8fb0",
      accentMuted: "rgba(255,107,157,0.12)",
      border: "rgba(74,29,106,0.08)",
      borderSubtle: "rgba(74,29,106,0.04)",
      danger: "#ff4444",
      success: "#66d9a0",
      warning: "#ffc857",
      surface: "#f5eeff",
      surfaceHover: "#ede3ff",
    },
    radius: "1.25rem",
    shadows: {
      sm: "0 1px 2px rgba(74,29,106,0.06)",
      md: "0 4px 12px rgba(74,29,106,0.08)",
      lg: "0 8px 24px rgba(74,29,106,0.1)",
      xl: "0 16px 48px rgba(74,29,106,0.12)",
      glow: "0 0 20px rgba(255,107,157,0.25)",
    },
  },
  {
    id: "cartoon-pop",
    name: "Cartoon Pop",
    description: "Bright, playful, bold colors",
    font: "Comic Neue",
    fontWeights: "300;400;700",
    colors: {
      background: "#fff9e6",
      backgroundElevated: "#fff3cc",
      backgroundGlass: "rgba(255,249,230,0.7)",
      foreground: "#1a1a1a",
      foregroundMuted: "#555555",
      foregroundSubtle: "#888888",
      accent: "#ff6b35",
      accentHover: "#ff8c5a",
      accentMuted: "rgba(255,107,53,0.12)",
      border: "rgba(0,0,0,0.08)",
      borderSubtle: "rgba(0,0,0,0.04)",
      danger: "#ff3333",
      success: "#00cc66",
      warning: "#ffaa00",
      surface: "#fff5d6",
      surfaceHover: "#ffeebb",
    },
    radius: "1.5rem",
    shadows: {
      sm: "2px 2px 0px rgba(0,0,0,0.1)",
      md: "4px 4px 0px rgba(0,0,0,0.12)",
      lg: "6px 6px 0px rgba(0,0,0,0.15)",
      xl: "8px 8px 0px rgba(0,0,0,0.18)",
      glow: "0 0 20px rgba(255,107,53,0.3)",
    },
  },
  {
    id: "nature-zen",
    name: "Nature Zen",
    description: "Earth tones, organic, calm",
    font: "Merriweather",
    fontWeights: "300;400;700",
    colors: {
      background: "#f5f0e8",
      backgroundElevated: "#ebe5d9",
      backgroundGlass: "rgba(245,240,232,0.7)",
      foreground: "#2c3e2d",
      foregroundMuted: "#5a6b5c",
      foregroundSubtle: "#8a9b8c",
      accent: "#6b8e5a",
      accentHover: "#7da36b",
      accentMuted: "rgba(107,142,90,0.12)",
      border: "rgba(44,62,45,0.08)",
      borderSubtle: "rgba(44,62,45,0.04)",
      danger: "#c0392b",
      success: "#27ae60",
      warning: "#d4a017",
      surface: "#eae3d6",
      surfaceHover: "#e0d8c9",
    },
    radius: "0.75rem",
    shadows: {
      sm: "0 1px 2px rgba(44,62,45,0.06)",
      md: "0 4px 12px rgba(44,62,45,0.08)",
      lg: "0 8px 24px rgba(44,62,45,0.1)",
      xl: "0 16px 48px rgba(44,62,45,0.12)",
      glow: "0 0 20px rgba(107,142,90,0.2)",
    },
  },
  {
    id: "ocean-deep",
    name: "Ocean Deep",
    description: "Deep blues, teals, mysterious",
    font: "Playfair Display",
    fontWeights: "400;500;600;700",
    colors: {
      background: "#0a1628",
      backgroundElevated: "#0f1f38",
      backgroundGlass: "rgba(10,22,40,0.7)",
      foreground: "#d4e6f1",
      foregroundMuted: "#85a8c4",
      foregroundSubtle: "#4a6b8a",
      accent: "#00bcd4",
      accentHover: "#26c6da",
      accentMuted: "rgba(0,188,212,0.12)",
      border: "rgba(212,230,241,0.08)",
      borderSubtle: "rgba(212,230,241,0.04)",
      danger: "#e74c3c",
      success: "#1abc9c",
      warning: "#f39c12",
      surface: "#0e1f3a",
      surfaceHover: "#14284a",
    },
    radius: "0.75rem",
    shadows: {
      sm: "0 1px 2px rgba(0,0,0,0.3)",
      md: "0 0 12px rgba(0,188,212,0.15)",
      lg: "0 0 24px rgba(0,188,212,0.2)",
      xl: "0 0 48px rgba(0,188,212,0.25)",
      glow: "0 0 30px rgba(0,188,212,0.3)",
    },
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Pure black and white, clean",
    font: "Inter",
    fontWeights: "300;400;500;600;700",
    colors: {
      background: "#000000",
      backgroundElevated: "#111111",
      backgroundGlass: "rgba(255,255,255,0.02)",
      foreground: "#ffffff",
      foregroundMuted: "#888888",
      foregroundSubtle: "#444444",
      accent: "#ffffff",
      accentHover: "#cccccc",
      accentMuted: "rgba(255,255,255,0.08)",
      border: "rgba(255,255,255,0.1)",
      borderSubtle: "rgba(255,255,255,0.05)",
      danger: "#ff0000",
      success: "#00ff00",
      warning: "#ffff00",
      surface: "#0a0a0a",
      surfaceHover: "#141414",
    },
    radius: "0.5rem",
    shadows: {
      sm: "0 1px 2px rgba(0,0,0,0.5)",
      md: "0 4px 12px rgba(0,0,0,0.6)",
      lg: "0 8px 24px rgba(0,0,0,0.7)",
      xl: "0 16px 48px rgba(0,0,0,0.8)",
      glow: "0 0 20px rgba(255,255,255,0.15)",
    },
  },
];

export const defaultTheme = themePresets[0];

export function getThemeById(id: string): ThemePreset {
  return themePresets.find((t) => t.id === id) || defaultTheme;
}

export function applyThemeToCSS(theme: ThemePreset) {
  const root = document.documentElement;
  root.style.setProperty("--theme-bg", theme.colors.background);
  root.style.setProperty("--theme-bg-elevated", theme.colors.backgroundElevated);
  root.style.setProperty("--theme-bg-glass", theme.colors.backgroundGlass);
  root.style.setProperty("--theme-fg", theme.colors.foreground);
  root.style.setProperty("--theme-fg-muted", theme.colors.foregroundMuted);
  root.style.setProperty("--theme-fg-subtle", theme.colors.foregroundSubtle);
  root.style.setProperty("--theme-accent", theme.colors.accent);
  root.style.setProperty("--theme-accent-hover", theme.colors.accentHover);
  root.style.setProperty("--theme-accent-muted", theme.colors.accentMuted);
  root.style.setProperty("--theme-border", theme.colors.border);
  root.style.setProperty("--theme-border-subtle", theme.colors.borderSubtle);
  root.style.setProperty("--theme-danger", theme.colors.danger);
  root.style.setProperty("--theme-success", theme.colors.success);
  root.style.setProperty("--theme-warning", theme.colors.warning);
  root.style.setProperty("--theme-surface", theme.colors.surface);
  root.style.setProperty("--theme-surface-hover", theme.colors.surfaceHover);
  root.style.setProperty("--theme-radius", theme.radius);
  root.style.setProperty("--theme-shadow-sm", theme.shadows.sm);
  root.style.setProperty("--theme-shadow-md", theme.shadows.md);
  root.style.setProperty("--theme-shadow-lg", theme.shadows.lg);
  root.style.setProperty("--theme-shadow-xl", theme.shadows.xl);
  root.style.setProperty("--theme-shadow-glow", theme.shadows.glow);
  root.style.setProperty("--theme-font", theme.font);
}
