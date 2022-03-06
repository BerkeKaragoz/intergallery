import { Box } from "@mui/system";
import AddMediaDialog, {
  AddMediaDialogProps,
} from "@/lib/Media/AddMediaDialog";
import { Button, Divider, Typography } from "@mui/material";
import Dropzone from "react-dropzone";
import useModal from "@/hooks/useModal/useModal";
import { useState } from "react";
import { MediaDTO, MediaType } from "@/lib/Media";

const MediaInfo = ({
  label,
  info,
}: {
  label?: React.ReactNode;
  info?: React.ReactNode;
}) => (
  <>
    <Typography variant="h6" component="p" children={label} />
    <Typography variant="body2" children={info} mb={2} />
  </>
);

type Props = {
  highlightedMedia?: MediaDTO | null;
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
        {highlightedMedia && (
          <Box>
            <MediaInfo label="Name" info={highlightedMedia.name} />
            {highlightedMedia.type !== MediaType.UNKNOWN && (
              <MediaInfo label="Type" info={MediaType[highlightedMedia.type]} />
            )}
            <MediaInfo
              label="Creation Date"
              info={new Date(highlightedMedia.creationDate).toString()}
            />
            {highlightedMedia.updateDate !== highlightedMedia.creationDate && (
              <MediaInfo
                label="Last Update Date"
                info={new Date(highlightedMedia.updateDate).toString()}
              />
            )}
            {highlightedMedia.sourceIds?.length > 1 && (
              <MediaInfo
                label="# of Sources"
                info={highlightedMedia.sourceIds.length}
              />
            )}
            <MediaInfo label="Owner ID" info={highlightedMedia.ownerId} />
          </Box>
        )}
        {children}
      </Box>
      <Divider flexItem orientation={"vertical"} sx={{ my: 5, opacity: 0.5 }} />
    </>
  );
};

export type { Props as MediaSidebarProps };
export default MediaSidebar;
