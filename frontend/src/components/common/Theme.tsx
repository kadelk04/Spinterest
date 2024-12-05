import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Open Sans',
  },
  palette: {
    mode: 'light',
    background: {
      default: '#ffffff',
      paper: '#fdfafb',
    },
    primary: {
      main: '#CFBCFF',
      light: '#E8DEF8',
      dark: '#65548F',
    },
    secondary: {
      main: '#FFD9E4',
      light: '#FEF8FF',
    },
  },
});

interface ThemeProps {
  children: React.ReactNode;
}

export const Theme = (props: ThemeProps) => {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};
