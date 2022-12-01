import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function Snackbar(theme: Theme): unknown {
  return {
    MuiSnackbarContent: {
      styleOverrides: {
        root: {},
      },
    },
  };
}
