import { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export default function Breadcrumbs(theme: Theme): unknown {
  return {
    MuiBreadcrumbs: {
      styleOverrides: {
        separator: {
          marginLeft: theme.spacing(2),
          marginRight: theme.spacing(2),
        },
      },
    },
  };
}
