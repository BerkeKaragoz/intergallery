import getDesignTokens from "@/theme";
import {
  createTheme,
  CssBaseline,
  LinearProgress,
  PaletteMode,
  ThemeProvider,
} from "@mui/material";
import React from "react";
import RoutesNonAuth from "./RoutesNonAuth";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { fetchGetUser } from "./redux/slice/userSlice";
import RoutesAuth from "./RoutesAuth";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ErrorBoundary from "./components/ErrorBoundary";

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {
  const [mode, setMode] = React.useState<PaletteMode>("dark");
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    try {
      const lastLoginData = JSON.parse(
        window.localStorage.getItem("lastLogin") ?? "{}",
      );

      //TODO remove the item when logging out

      if (lastLoginData["id"]) dispatch(fetchGetUser());
    } catch (ex) {}
  }, []);
  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === "light" ? "dark" : "light",
        );
      },
    }),
    [],
  );

  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          {userState.isLoading ? (
            <LinearProgress />
          ) : userState.data.id ? (
            <>
              <Header user={userState.data} />
              <RoutesAuth />
              <Footer />
            </>
          ) : (
            <RoutesNonAuth />
          )}
        </ErrorBoundary>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
