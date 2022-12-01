import { CssBaseline } from "@mui/material";
import {
  alpha,
  createTheme,
  StyledEngineProvider,
  ThemeOptions,
  ThemeProvider,
} from "@mui/material/styles";
import { ReactNode, useMemo } from "react";
import useAppearance from "../hooks/useAppearance";
import breakpoints from "./breakpoint";
import ComponentsOverrides from "./overrides";
import palette, { PRIMARY_COLOR } from "./palette";
import shadows, { customShadows } from "./shadows";
import shape from "./shape";
import typography from "./typography";

interface ThemeConfigurationProps {
  children: ReactNode;
}

export default function ThemeConfiguration({
  children,
}: ThemeConfigurationProps): JSX.Element {
  //自定义 theme options。切换白夜模式、更改颜色主题时引发数值重设。
  const appearance = useAppearance();
  const themeMode = appearance.getThemeMode();
  const themeColor = appearance.getThemeColor();
  const primaryColor = PRIMARY_COLOR[themeColor];
  const themeOptions: ThemeOptions = useMemo(() => {
    return {
      palette: {
        ...palette[themeMode],
        mode: themeMode,
        primary: primaryColor,
      },
      shape,
      typography,
      breakpoints,
      shadows: shadows[themeMode],
      customShadows: {
        ...customShadows[themeMode],
        primary: `0 8px 16px 0 ${alpha(primaryColor.main, 0.24)}`,
      },
    };
  }, [themeMode, primaryColor]);

  const theme = createTheme(themeOptions);
  theme.components = ComponentsOverrides(theme);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
