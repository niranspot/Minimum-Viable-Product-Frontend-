import { createTheme } from '@mui/material/styles';

export const tokens = {
  primary:      '#1565C0',
  green:        '#2E7D32',
  orange:       '#E65100',
  red:          '#C62828',
  blue:         '#3B82F6',
  dark:         '#1A1A2E',
  grey:         '#718096',
  border:       '#E2E8F0',
  borderDark:   'rgba(255,255,255,0.08)',
};

export const warmTheme = {
  primary:      '#1565C0',
  primaryLight: '#E3F0FF',
  green:        '#2E7D32',
  orange:       '#E65100',
  red:          '#C62828',
  blue:         '#3B82F6',
  dark:         '#1A1A2E',
  grey:         '#718096',
  border:       '#E2E8F0',

  bg:       '#F7F9FC',
  surface:  '#FFFFFF',
  text:     '#1A1A2E',
  textMuted:'#718096',
  divider:  '#E2E8F0',

  sidebarBg:   '#1A1A2E',
  sidebarText: '#FFFFFF',
};

export const darkTheme = {
  ...warmTheme,
  bg:       '#0D1117',
  surface:  '#161B22',
  text:     '#E6EDF3',
  textMuted:'#8B949E',
  divider:  'rgba(255,255,255,0.08)',

  sidebarBg:   '#1A1A2E',
  sidebarText: '#FFFFFF',
};

export const getTheme = (theme) => {
  const mode = theme === 'dark' ? 'dark' : 'light'; // MUI only knows light/dark internally
  return createTheme({
    palette: {
      mode,
      primary: { main: tokens.primary },
      success: { main: tokens.green },
      error:   { main: tokens.red },
      warning: { main: tokens.orange },
      background: {
        default: theme === 'dark' ? '#0D1117' : '#F7F9FC',
        paper:   theme === 'dark' ? '#161B22' : '#FFFFFF',
      },
      text: {
        primary:   theme === 'dark' ? '#E6EDF3' : tokens.dark,
        secondary: theme === 'dark' ? '#8B949E' : tokens.grey,
      },
      divider: theme === 'dark' ? tokens.borderDark : tokens.border,
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
            padding: "8px 20px",
            boxShadow: "none",

            "&:hover": {
              boxShadow: "none",
            },

            "&.Mui-disabled": {
              background:
                theme === "dark"
                  ? "#30363D"
                  : "#CBD5E0",

              color:
                theme === "dark"
                  ? "#8B949E"
                  : "#4A5568",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: theme === "dark" ? "#161B22" : "#FFFFFF",
            boxShadow:
              theme === "dark"
                ? "0 2px 12px rgba(0,0,0,0.3)"
                : "0 2px 12px rgba(0,0,0,0.06)",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
              color: theme === "dark" ? "#E6EDF3" : "#1A1A2E",

              "& fieldset": {
                borderColor: theme === "dark"
                  ? "rgba(255,255,255,0.15)"
                  : "#E2E8F0",
              },

              "&:hover fieldset": {
                borderColor: tokens.primary,
              },

              "&.Mui-focused fieldset": {
                borderColor: tokens.primary,
              },
            },
            "&.Mui-disabled fieldset": {
              borderColor:
                theme === "dark"
                  ? "rgba(255,255,255,0.08)"
                  : "#E2E8F0",
            },

            "& .MuiInputLabel-root": {
              color: theme === "dark"
                ? "#8B949E"
                : "#718096",
            },

            "& .MuiInputLabel-root.Mui-focused": {
              color: tokens.primary,
            },

            "& .MuiSvgIcon-root": {
              color: theme === "dark"
                ? "#8B949E"
                : "#718096",
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: theme === "dark" ? "#8B949E" : "#718096",

            "&.Mui-checked": {
              color: tokens.primary,
            },
          },
        },
      },
    },
  });
};