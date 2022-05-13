import { Box } from "@mui/system";
import Dropzone, { DropzoneOptions } from "react-dropzone";

type Props = {
  onDrop?: DropzoneOptions["onDrop"];
};

const AppDropzone = ({ onDrop }: Props) => (
  <Dropzone onDrop={onDrop}>
    {({ getRootProps, getInputProps }) => (
      <Box
        sx={{
          borderWidth: 2,
          borderStyle: "dashed",
          borderColor: "gray",
          borderRadius: 2,
          p: 2,
          my: 2,
          textAlign: "center",
          cursor: "pointer",
          transition: "0.2s",
          "&:hover": {
            backgroundColor: "#0003",
          },
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <p>Drop files here.</p>
      </Box>
    )}
  </Dropzone>
);

export default AppDropzone;
