/**
 * 自定义 render 函数以应用 wrapper
 * 之后的 Provider 也应当加入 wrapper 中
 */

import { SnackbarProvider } from "notistack";
import { FC, ReactElement } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as AppearanceProvider } from "../../contexts/AppearanceContext";
import { Provider as UserAuthProvider } from "../../contexts/user/AuthContext";
import { store, persistor } from "../../redux/store";
import ThemeConfiguration from "../../themes";
import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import LoadingScreen from "../../components/general/LoadingScreen";
import UserGuestGuard from "../../guards/UserGuestGuard";

const Providers: FC = ({ children }) => {
  return (
    <HelmetProvider>
      <ReduxProvider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <BrowserRouter>
            <AppearanceProvider>
              <ThemeConfiguration>
                <UserAuthProvider>
                  <SnackbarProvider>
                    <UserGuestGuard>{children}</UserGuestGuard>
                  </SnackbarProvider>
                </UserAuthProvider>
              </ThemeConfiguration>
            </AppearanceProvider>
          </BrowserRouter>
        </PersistGate>
      </ReduxProvider>
    </HelmetProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
): RenderResult => render(ui, { wrapper: Providers, ...options });

export * from "@testing-library/react";
export { customRender as render };
