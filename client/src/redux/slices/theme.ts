import { PaletteMode } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";
import { PaletteColor } from "../../types/palette";

export type State = {
  themeMode: PaletteMode;
  themeColor: PaletteColor;
};

const initialState: State = {
  themeMode: "light",
  themeColor: "blue",
};

const slice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode(
      state,
      action: { payload: { mode: PaletteMode }; type: string }
    ) {
      state.themeMode = action.payload.mode;
    },
    setThemeColor(
      state,
      action: { payload: { color: PaletteColor }; type: string }
    ) {
      state.themeColor = action.payload.color;
    },
  },
});

export const actions = slice.actions;
export const reducer = slice.reducer;
