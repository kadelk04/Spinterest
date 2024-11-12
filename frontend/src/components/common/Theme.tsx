import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#F2F2F1',
      paper: '#EBEBEA',
    },
    primary: {
      main: '#6a994e',
      light: '#a7c957',
      dark: '#386641',
    },
    secondary: {
      main: '#bc4749',
    },
  },
});

interface ThemeProps {
  children: React.ReactNode;
}

export const Theme = (props: ThemeProps) => {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};
