import { Container } from "@mui/material";
import React from "react";

const Main: React.FC<{}> = (props) => {
  const { children } = props;

  return (
    <Container component={"main"} maxWidth={"xl"} sx={{ mt: 2 }}>
      {children}
    </Container>
  );
};

export default Main;
