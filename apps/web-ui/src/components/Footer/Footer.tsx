import { API_BASE_URL } from "@/lib/api";
import { SIDEBAR_BREAKPOINT } from "@/modules/Media/MediaSidebar";
import {
  Button,
  Container,
  Theme,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import React from "react";

const Footer = () => {
  const matchesSidebar = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up(SIDEBAR_BREAKPOINT),
  );

  return (
    <>
      <Container component="footer" maxWidth="xl" sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          component="a"
          href={API_BASE_URL + "/auth/logout"}
        >
          Logout
        </Button>
      </Container>
      <Toolbar sx={{ display: matchesSidebar ? "none" : "block", mt: 1 }} />
    </>
  );
};

export default Footer;
