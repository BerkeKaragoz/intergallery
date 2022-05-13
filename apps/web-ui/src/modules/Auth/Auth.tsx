import { Container, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useLocation } from "react-router";
import LoginBox from "./LoginBox";
import RegisterBox from "./RegisterBox";

const REGISTER_HASH = "#sign-up";

const Auth = () => {
  const { hash } = useLocation();

  return (
    <Box component="main">
      <Box
        sx={{
          width: "80%",
          height: "80vh",
          minHeight: "512px",
          backgroundImage: 'url("/assets/kaung-myat-halfblurred-min.jpg")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 3,
          boxShadow: "0px 4px 24px 12px rgba(0, 0, 0, 0.25)",
          textAlign: "center",
          zIndex: "-1",
          transform: "translate(-50%, -55%)",
          position: "absolute",
          top: "50%",
          left: "50%",
          "@media screen and (max-height: 500px)": {
            position: "fixed",
            transform: "translate(-50%, -50%)",
            margin: 0,
            borderRadius: 0,
            width: "100%",
            height: "100%",
          },
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontWeight: 100,
            fontSize: "4rem",
            opacity: 0.8,
            letterSpacing: "0.1rem",
            mt: 8,
            "@media screen and (max-height: 648px)": {
              visibility: "hidden",
            },
            "@media screen and (max-width: 500px)": {
              fontSize: "2rem",
            },
          }}
        >
          Intergallery
        </Typography>
      </Box>
      <Paper
        sx={[
          {
            borderRadius: 2,
            maxWidth: "512px",
            minWidth: "275px",
            width: "99%",
            border: 1,
            borderColor: "primary.main",
            boxShadow: "0px 20px 24px 12px rgba(0, 0, 0, 0.5)",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            py: 6,
            px: 2,
            "@media screen and (max-height: 500px)": {
              position: "static",
              transform: "translate(0,0)",
              margin: "auto",
              borderRadius: 0,
              borderTop: "1px solid #fff0",
              borderBottom: "1px solid #fff0",
              minHeight: "100vh",
            },
          },
          (theme) => ({
            backgroundColor: `${theme.palette.background.paper}EE`,
            "@supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none))":
              {
                backgroundColor: `${theme.palette.background.paper}DD`,
                backdropFilter: "blur(8px)",
              },
          }),
        ]}
      >
        <Container maxWidth="xs">
          {hash !== REGISTER_HASH ? <LoginBox /> : <RegisterBox />}
        </Container>
      </Paper>
    </Box>
  );
};

export default Auth;
