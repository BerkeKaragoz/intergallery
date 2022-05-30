import { SIDEBAR_BREAKPOINT } from "@/modules/Browse/BrowseSidebar"
import {
   Box,
   Container,
   Divider,
   Link,
   Theme,
   Toolbar,
   Typography,
   useMediaQuery,
} from "@mui/material"
import React from "react"

const Footer = () => {
   const matchesSidebar = useMediaQuery((theme: Theme) =>
      theme.breakpoints.up(SIDEBAR_BREAKPOINT)
   )

   return (
      <>
         <Divider light sx={{ mt: 4 }} />
         <Container component="footer" maxWidth="xl" sx={{ mt: 2 }}>
            <Box sx={{ textAlign: "center", m: 1 }}>
               <Typography
                  component={Link}
                  variant="h5"
                  align="center"
                  sx={{ opacity: 0.2 }}
                  href="berkekaragoz.com"
               >
                  berkekaragoz.com
               </Typography>
            </Box>
         </Container>
         <Toolbar sx={{ display: matchesSidebar ? "none" : "block", mt: 1 }} />
      </>
   )
}

export default Footer
