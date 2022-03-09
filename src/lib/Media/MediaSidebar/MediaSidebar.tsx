import { Box } from "@mui/system";
import AddMediaDialog, {
  AddMediaDialogProps,
} from "@/lib/Media/AddMediaDialog";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Typography,
} from "@mui/material";
import Dropzone from "react-dropzone";
import useAppModal from "@/hooks/useAppModal";
import { useState } from "react";
import { MediaDTO, MediaType } from "@/lib/Media";
import AppDropzone from "@/components/AppDropzone";
import { UserState } from "@/redux/slice/userSlice";
import { PaginatedDTO } from "@/lib/types";
import { useNavigate } from "react-router";
import { createSearchParams } from "react-router-dom";

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
  userId?: UserState["data"]["id"];
};

const MediaSidebar: React.FC<Props> = (props) => {
  const { highlightedMedia, userId, children } = props;
  const [addMediaValues, setAddMediaValues] = useState<
    AddMediaDialogProps["initialValues"]
  >({});
  const [AddMediaModal, openAddMedia, closeAddMedia] = useAppModal();

  return (
    <>
      <Box
        component="aside"
        sx={{
          display: "flex",
          flexDirection: "column",
          mx: 2,
          pb: 2,
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
        <AppDropzone
          onDrop={(acceptedFiles) => {
            console.log(acceptedFiles);
            setAddMediaValues({ URL: acceptedFiles[0].name, "Is Local": true });
            openAddMedia();
          }}
        />

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
            {userId !== highlightedMedia.ownerId && (
              <MediaInfo label="Owner ID" info={highlightedMedia.ownerId} />
            )}
          </Box>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {children}
      </Box>
      <Divider flexItem orientation={"vertical"} sx={{ my: 5, opacity: 0.5 }} />
    </>
  );
};

export type { Props as MediaSidebarProps };
export default MediaSidebar;
