import {
  CaseReducer,
  CaseReducerActions,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

export type State = {
  accessToken: string | null;
  isSuper: boolean;
};

export const initialState: State = {
  accessToken: null,
  isSuper: false,
};

type Reducers<S extends State> = {
  initialize: CaseReducer<S>;
  login: CaseReducer<
    S,
    PayloadAction<{ accessToken: string; isSuper: boolean }>
  >;
  setIsSuper: CaseReducer<S, PayloadAction<{ isSuper: boolean }>>;
  logout: CaseReducer<S>;
};

export const reducers = <S extends State>(): Reducers<S> => ({
  initialize(state) {
    if (state.accessToken !== null) {
      axios.defaults.headers.common.Authorization = state.accessToken;
    }
  },
  login(state, action) {
    state.accessToken = action.payload.accessToken;
    state.isSuper = action.payload.isSuper;
    axios.defaults.headers.common.Authorization = action.payload.accessToken;
  },
  setIsSuper(state, action) {
    state.isSuper = action.payload.isSuper;
  },
  logout(state) {
    state.accessToken = null;
    state.isSuper = false;
    delete axios.defaults.headers.common.Authorization;
  },
});

export type Actions<S extends State> = CaseReducerActions<Reducers<S>>;
