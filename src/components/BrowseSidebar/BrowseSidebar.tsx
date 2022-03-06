import { Box } from "@mui/system";
import AddMediaDialog, {
  AddMediaDialogProps,
} from "@/components/AddMediaDialog";
import { Button, Divider } from "@mui/material";
import Dropzone from "react-dropzone";
import useModal from "@/hooks/useModal/useModal";
import { useState } from "react";

type Props = {
  highlightedMedia?: any;
};

const BrowseSidebar: React.FC<Props> = (props) => {
  const { highlightedMedia, children } = props;
  const [addMediaValues, setAddMediaValues] = useState<
    AddMediaDialogProps["initialValues"]
  >({});
  const [AddMediaModal, openAddMedia, closeAddMedia] = useModal();

  return (
    <>
      <Box
        component="aside"
        sx={{ mx: 2, width: 256, flexShrink: 0, overflow: "auto" }}
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

export type { Props as BrowseSidebarProps };
export default BrowseSidebar;
