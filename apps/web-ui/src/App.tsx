import ErrorBoundary from "@/components/ErrorBoundary"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { fetchGetUser, setIsUserLoading } from "@/redux/slice/userSlice"
import RoutesAuth from "@/RoutesAuth"
import RoutesNonAuth from "@/RoutesNonAuth"
import getDesignTokens from "@/theme"
import {
   CssBaseline,
   LinearProgress,
   PaletteMode,
   ThemeProvider,
   createTheme,
} from "@mui/material"
import GlobalStyles from "@mui/material/GlobalStyles"
import React from "react"
import { useLocation } from "react-router"

const ColorModeContext = React.createContext({ toggleColorMode: () => {} })

const inputGlobalStyles = (
   <GlobalStyles
      styles={{
         img: {
            backgroundColor: "#fff1",
         },
         "img[alt]": {
            textAlign: "center",
            fontWeight: "lighter",
            fontSize: 0,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
         },
         "img[alt]::before": {
            fontSize: "medium",
            display: "block",
            position: "relative",
            top: "50%",
            transform: "translateY(-50%)",
            wordWrap: "break-word",
            maxHeight: "100%",
            maxWidth: "100%",
            padding: "1rem",
            alignItems: "center",
            justifyContent: "center",
            color: "aliceblue",
            textShadow: "0 0 1.125rem #fff",
         },
      }}
   />
)

function App() {
   const [mode, setMode] = React.useState<PaletteMode>("dark")
   const userState = useAppSelector((state) => state.user)
   const dispatch = useAppDispatch()

   React.useEffect(() => {
      try {
         const lastLoginData = JSON.parse(
            window.localStorage.getItem("lastLogin") ?? "{}"
         )

         // TODO remove the item when logging out

         if (lastLoginData["id"]) dispatch(fetchGetUser())
         else dispatch(setIsUserLoading(false))
      } catch (ex) {}
   }, [])

   const colorMode = React.useMemo(
      () => ({
         // The dark mode switch would invoke this method
         toggleColorMode: () => {
            setMode((prevMode: PaletteMode) =>
               prevMode === "light" ? "dark" : "light"
            )
         },
      }),
      []
   )

   // Update the theme only if the mode changes
   const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode])

   const loc = useLocation()

   return (
      <ColorModeContext.Provider value={colorMode}>
         <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            {inputGlobalStyles}
            <ErrorBoundary>
               {userState.isLoading ? (
                  <LinearProgress />
               ) : userState.data.id ? (
                  <>
                     <Header user={userState.data} />
                     <RoutesAuth location={loc} />
                     <Footer />
                  </>
               ) : (
                  <RoutesNonAuth location={loc} />
               )}
            </ErrorBoundary>
         </ThemeProvider>
      </ColorModeContext.Provider>
   )
}

export default App
