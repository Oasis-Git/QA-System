import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function IconButton(theme: Theme): unknown {
  return {
    MuiIconButton: {
      styleOverrides: {
        root: {},
      },
    },
  };
}
