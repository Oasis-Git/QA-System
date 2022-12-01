import { SnackbarProvider } from "notistack";
import { HelmetProvider } from "react-helmet-async";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import "simplebar/src/simplebar.css"; // scroll bar
import LoadingScreen from "./components/general/LoadingScreen";
import Settings from "./components/general/settings";
import { Provider as AppearanceProvider } from "./contexts/AppearanceContext";
import { CollapseDrawerProvider } from "./contexts/user/CollapseDrawerContext";
import { persistor, store } from "./redux/store";
import Router from "./routes";
import ThemeConfiguration from "./themes";
import GlobalStyles from "./themes/globalStyles";

function App(): JSX.Element {
  return (
    <HelmetProvider>
      <ReduxProvider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <AppearanceProvider>
            <CollapseDrawerProvider>
              <SnackbarProvider>
                <ThemeConfiguration>
                  <GlobalStyles />
                  <Settings />
                  <BrowserRouter>
                    <Router />
                  </BrowserRouter>
                </ThemeConfiguration>
              </SnackbarProvider>
            </CollapseDrawerProvider>
          </AppearanceProvider>
        </PersistGate>
      </ReduxProvider>
    </HelmetProvider>
  );
}

export default App;
