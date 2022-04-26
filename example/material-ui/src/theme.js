import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import { red } from '@mui/material/colors';
import createCache from '@emotion/cache';

const createEmotionCache = () => {
  return createCache({ key: 'css', prepend: true });
}

const cache = createEmotionCache();

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

const Theme = (props) => (
  <CacheProvider value={cache}>
    <ThemeProvider theme={theme}>
      { props.children }
    </ThemeProvider>
  </CacheProvider>
);

export default Theme;
