import React, { createContext, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { CssBaseline } from '@mui/material';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { getTheme, warmTheme, darkTheme } from '../themes/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const theme_settings = useSelector(state => state.tenant.theme_settings);
  const mode = theme_settings === 'dark' ? 'dark' : 'warm';

  const muiTheme    = useMemo(() => getTheme(mode), [mode]);
  const styledTheme = mode === 'dark' ? darkTheme : warmTheme;

  const antdConfig = useMemo(() => ({
    algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: styledTheme.primary,
      colorBgContainer: styledTheme.surface,
      colorBgElevated: styledTheme.surface,
      colorText: styledTheme.text,
      colorTextSecondary: styledTheme.textMuted,
      colorBorder: styledTheme.divider,
      borderRadius: 8,
    },
  }), [mode, styledTheme]);

  return (
    <ThemeContext.Provider value={{ mode }}>
      <MuiThemeProvider theme={muiTheme}>
        <StyledThemeProvider theme={styledTheme}>
          <ConfigProvider theme={antdConfig}>
            <CssBaseline />
            {children}
          </ConfigProvider>
        </StyledThemeProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => useContext(ThemeContext);