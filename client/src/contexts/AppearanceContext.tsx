import { PaletteMode } from "@mui/material";
import { createContext, ReactNode, useCallback } from "react";
import { actions as themeActions } from "../redux/slices/theme";
import { useDispatch, useSelector } from "../redux/store";
import { PaletteColor } from "../types/palette";

export type ContextType = {
  getThemeMode: () => PaletteMode;
  getThemeColor: () => PaletteColor;
  setThemeMode: (mode: PaletteMode) => void;
  setThemeColor: (color: PaletteColor) => void;
};

export const Context = createContext<ContextType | null>(null);

export function Provider({ children }: { children: ReactNode }): JSX.Element {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);

  const getThemeMode = useCallback(() => theme.themeMode, [theme.themeMode]);
  const getThemeColor = useCallback(() => theme.themeColor, [theme.themeColor]);

  const setThemeMode = useCallback(
    (mode: PaletteMode) => {
      dispatch(themeActions.setThemeMode({ mode }));
    },
    [dispatch]
  );
  const setThemeColor = useCallback(
    (color: PaletteColor) => {
      dispatch(themeActions.setThemeColor({ color }));
    },
    [dispatch]
  );

  return (
    <Context.Provider
      value={{
        getThemeMode,
        getThemeColor,
        setThemeMode,
        setThemeColor,
      }}
    >
      {children}
    </Context.Provider>
  );
}
