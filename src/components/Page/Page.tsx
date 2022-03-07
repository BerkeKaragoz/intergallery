import { Container } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

type Props = {
  sidebar?: React.ReactNode;
};

const Page: React.FC<Props> = (props) => {
  const { children, sidebar } = props;

  return (
    <Box sx={{ display: "flex", width: "100%", flexGrow: 1 }}>
      {sidebar && sidebar}
      <Container component={"main"} maxWidth={"xl"} sx={{ mt: 2 }}>
        {children}
      </Container>
    </Box>
  );
};

export type { Props as PageProps };
export default Page;
