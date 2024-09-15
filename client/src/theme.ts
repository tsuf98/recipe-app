// import { extendTheme } from '@mui/joy/styles';

import { extendTheme } from "@mui/material";

const theme = extendTheme({
  components: {
    MuiChip: {
      styleOverrides: {
        outlined: {
          backgroundColor: "white",
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        formControl: {
          backgroundColor: "white",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        outlined: {
          backgroundColor: "white",
        },
      },
    },
  },
  typography: {
    h6: {
      color: "#ef6c00",
      fontFamily: "Roboto Slab, sans-serif",
    },
    h5: {
      color: "#e65100",
      fontFamily: "Roboto Slab, sans-serif",
    },
    button: {
      textTransform: "none",
      fontWeight: 400,
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          light: "#ffcc80",
          main: "#ff9800",
          dark: "#ef6c00",
          contrastText: "#ffffff",
        },
        secondary: {
          light: "#fafafa",
          main: "#ffffff",
          dark: "#aaaaaa",
          contrastText: "#ff9800",
        },
      },
    },
  },
});

export default theme;
