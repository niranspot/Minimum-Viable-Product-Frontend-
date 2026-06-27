import { createTheme } from '@mui/material/styles';

export const tokens = {
  primary:      '#1565C0',
  primaryLight: '#E3F0FF',
  green:        '#2E7D32',
  greenBg:      '#1B8A5A',
  orange:       '#E65100',
  orangeBg:     '#F59E0B',
  red:          '#C62828',
  redBg:        '#E53E3E',
  blue:         '#1565C0',
  blueBg:       '#3B82F6',
  dark:         '#1A1A2E',
  darkMid:      '#16213E',
  darkSurface:  '#0F3460',
  white:        '#FFFFFF',
  grey:         '#718096',
  border:       '#E2E8F0',
  borderDark:   'rgba(255,255,255,0.08)',
};

// Styled Components theme object — mirrors your tokens
export const lightTheme = {
  primary:     '#1565C0',
  primaryLight:'#E3F0FF',
  green:       '#2E7D32',
  orange:      '#E65100',
  red:         '#C62828',
  blue:        '#3B82F6',
  dark:        '#1A1A2E',
  grey:        '#718096',
  border:      '#E2E8F0',

  // Page level
  bg:          '#F7F9FC',
  surface:     '#FFFFFF',
  text:        '#1A1A2E',
  textMuted:   '#718096',
  divider:     '#E2E8F0',

  // Sidebar — always dark regardless of theme
  sidebarBg:   '#1A1A2E',
  sidebarText: '#FFFFFF',
};

export const darkTheme = {
  ...lightTheme,

  // Only these change in dark mode
  bg:          '#0D1117',
  surface:     '#161B22',
  text:        '#E6EDF3',
  textMuted:   '#8B949E',
  divider:     'rgba(255,255,255,0.08)',

  // Sidebar stays same dark
  sidebarBg:   '#1A1A2E',
  sidebarText: '#FFFFFF',
};

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: tokens.primary },
      success: { main: tokens.green },
      error:   { main: tokens.red },
      warning: { main: tokens.orange },
      background: {
        default: mode === 'light' ? '#F7F9FC' : '#0D1117',
        paper:   mode === 'light' ? '#FFFFFF'  : '#161B22',
      },
      text: {
        primary:   mode === 'light' ? tokens.dark  : '#E6EDF3',
        secondary: mode === 'light' ? tokens.grey  : '#8B949E',
      },
      divider: mode === 'light' ? tokens.border : tokens.borderDark,
    },
    typography: {
      fontFamily: `'Inter', 'Roboto', sans-serif`,
      h1: { fontWeight: 700, fontSize: '2rem' },
      h2: { fontWeight: 700, fontSize: '1.6rem' },
      h3: { fontWeight: 600, fontSize: '1.25rem' },
      h4: { fontWeight: 600, fontSize: '1.1rem' },
      body1: { fontSize: '0.95rem' },
      body2: { fontSize: '0.85rem' },
      button: { textTransform: 'none', fontWeight: 600 },
      caption: { fontSize: '0.78rem' },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 20px',
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'light'
              ? '0 2px 12px rgba(0,0,0,0.06)'
              : '0 2px 12px rgba(0,0,0,0.3)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': { borderRadius: 8 },
          },
        },
      },
    },
  });