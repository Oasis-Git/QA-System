import { createStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from "react-redux";
import { persistCombineReducers, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { reducer as adminAuthReducer } from "./slices/adminAuth";
import { reducer as themeReducer } from "./slices/theme";
import { reducer as userAuthReducer } from "./slices/userAuth";

const reducer = persistCombineReducers(
  {
    key: "redux",
    storage,
  },
  {
    adminAuth: adminAuthReducer,
    theme: themeReducer,
    userAuth: userAuthReducer,
  }
);

export const store = createStore(reducer);
export const persistor = persistStore(store);

export type Dispatch = typeof store.dispatch;
export type State = ReturnType<typeof store.getState>;

export const useDispatch = (): Dispatch => useReduxDispatch<Dispatch>();
export const useSelector: TypedUseSelectorHook<State> = useReduxSelector;
