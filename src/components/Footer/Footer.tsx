import { API_BASE_URL } from "@/lib/api";
import { Button, Container } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <Container component="footer" maxWidth="xl">
      <Button
        variant="outlined"
        component="a"
        href={API_BASE_URL + "/auth/logout"}
      >
        Logout
      </Button>
    </Container>
  );
};

export default Footer;
