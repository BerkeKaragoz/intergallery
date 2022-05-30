import { alpha, LinkProps, PaletteMode } from "@mui/material"
import AppLink from "@/components/AppLink"

const paletteLight = {
   primary: {
      main: "#e91e63",
      contrastText: "#efefff",
   },
   secondary: {
      main: "#80DEEA",
   },
   divider: "rgba(239,239,255,0.8)",
}

const paletteDark = {
   primary: {
      main: "#e91e63",
      contrastText: "#efefff",
   },
   secondary: {
      main: "#80DEEA",
   },
   background: {
      default: "#303030",
      paper: "#222222",
   },
   text: {
      primary: "#efefff",
   },
   divider: "rgba(239,239,255,0.8)",
}

const getDesignTokens = (mode: PaletteMode) => ({
   palette: {
      mode,
      ...(mode === "light" ? paletteLight : paletteDark),
   },
   shape: {
      borderRadius: 4,
   },
   components: {
      MuiLink: {
         defaultProps: {
            component: AppLink,
            color: "secondary",
         } as LinkProps,
      },
      MuiButtonBase: {
         defaultProps: {
            LinkComponent: AppLink,
         },
      },
      MuiAppBar: {
         styleOverrides: {
            root: {
               backgroundColor: alpha(
                  mode === "light"
                     ? paletteLight.primary.main
                     : paletteDark.primary.main,
                  0.8
               ),
               backdropFilter: "blur(4px)",
            },
         },
      },
   },
})

export default getDesignTokens
