import { Container } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

type Props = {
  sidebar?: React.ReactNode;
};

// flex direction is reverse because otherwise hovering cards
// cause content shift when the sidebar adds a line
// that is because first child takes priority over growth and
// scrolling in DOM. Therefore we moke the main first in dom
// and reverse the direction with flexbox
const Page: React.FC<Props> = (props) => {
  const { children, sidebar } = props;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row-reverse",
        width: "100%",
        flexGrow: 1,
      }}
    >
      <Container component={"main"} maxWidth={"xl"}>
        {children}
      </Container>
      {sidebar && sidebar}
    </Box>
  );
};

export type { Props as PageProps };
export default Page;
