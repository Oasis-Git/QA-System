import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function Container(theme: Theme): unknown {
  return {
    MuiContainer: {
      styleOverrides: {
        root: {},
      },
    },
  };
}
