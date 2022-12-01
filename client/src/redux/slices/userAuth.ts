import { createSlice } from "@reduxjs/toolkit";
import { initialState, reducers, State as AuthState } from "./auth";

export type State = AuthState;

const slice = createSlice({
  name: "userAuth",
  initialState,
  reducers: reducers(),
});

export const actions = slice.actions;
export const reducer = slice.reducer;
