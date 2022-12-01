export type PaletteColor =
  | "green"
  | "purple"
  | "cyan"
  | "blue"
  | "orange"
  | "red";

export type ColorSchema =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error";

export type ColorSet = {
  name: PaletteColor;
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
  contrastText: string;
};
