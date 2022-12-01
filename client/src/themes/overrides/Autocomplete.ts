import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function Autocomplete(theme: Theme): unknown {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows.z20,
        },
      },
    },
  };
}
