import { createSlice } from "@reduxjs/toolkit";
import { initialState, reducers, State as AuthState } from "./auth";

export type State = AuthState & {
  activated: boolean;
};

const slice = createSlice({
  name: "adminAuth",
  initialState: {
    activated: true,
    ...initialState,
  },
  reducers: {
    setActivated(state, action: { payload: { activated: boolean } }) {
      state.activated = action.payload.activated;
    },
    ...reducers<State>(),
  },
});

export const actions = slice.actions;
export const reducer = slice.reducer;
