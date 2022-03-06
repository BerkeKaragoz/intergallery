import { Box } from "@mui/system";
import AddMediaDialog, {
  AddMediaDialogProps,
} from "@/lib/Media/AddMediaDialog";
import { Button, Divider } from "@mui/material";
import Dropzone from "react-dropzone";
import useModal from "@/hooks/useModal/useModal";
import { useState } from "react";
import { MediaDTO } from "@/lib/Media";

type Props = {
  highlightedMedia?: MediaDTO;
};

const MediaSidebar: React.FC<Props> = (props) => {
  const { highlightedMedia, children } = props;
  const [addMediaValues, setAddMediaValues] = useState<
    AddMediaDialogProps["initialValues"]
  >({});
  const [AddMediaModal, openAddMedia, closeAddMedia] = useModal();

  return (
    <>
      <Box
        component="aside"
        sx={{
          mx: 2,
          width: 256,
          flexShrink: 0,
          wordWrap: "break-word",
          overflowX: "hidden",
        }}
      >
        <AddMediaModal fullWidth>
          <AddMediaDialog
            cancelHandler={closeAddMedia}
            initialValues={addMediaValues}
          />
        </AddMediaModal>
        <Button
          color="secondary"
          variant="contained"
          fullWidth
          onClick={openAddMedia}
        >
          Add Media
        </Button>
        <Dropzone
          onDrop={(acceptedFiles) => {
            console.log(acceptedFiles);
            setAddMediaValues({ URL: acceptedFiles[0].name, "Is Local": true });
            openAddMedia();
          }}
        >
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
        {JSON.stringify(highlightedMedia, null, 2)}
        {children}
      </Box>
      <Divider flexItem orientation={"vertical"} sx={{ my: 5, opacity: 0.5 }} />
    </>
  );
};

export type { Props as MediaSidebarProps };
export default MediaSidebar;
