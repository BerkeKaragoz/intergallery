import { Box, BoxProps } from "@mui/material"
import Dropzone, { DropzoneOptions } from "react-dropzone"

type Props = Omit<BoxProps, "onDrop"> & {
   onDrop?: DropzoneOptions["onDrop"]
}

const AppDropzone = ({ onDrop, sx, ...rest }: Props) => (
   <Dropzone onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
         <Box
            sx={{
               borderWidth: 2,
               borderStyle: "dashed",
               borderColor: "gray",
               borderRadius: 2,
               p: 4,
               my: 2,
               textAlign: "center",
               cursor: "pointer",
               transition: "0.2s",
               "&:hover": {
                  backgroundColor: "#0003",
               },
               ...sx,
            }}
            {...rest}
            {...getRootProps()}
         >
            <input {...getInputProps()} />
            <span>Drop files here.</span>
         </Box>
      )}
   </Dropzone>
)

export default AppDropzone
