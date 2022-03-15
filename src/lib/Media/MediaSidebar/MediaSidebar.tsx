import AppDropzone from "@/components/AppDropzone";
import useAppModal from "@/hooks/useAppModal";
import { MediaDTO, MediaType } from "@/lib/Media";
import AddMediaDialog, {
  AddMediaDialogProps,
} from "@/lib/Media/AddMediaDialog";
import { UserState } from "@/redux/slice/userSlice";
import { Button, Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";

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

const decideMediaType = (typeString = "") => {
  if (typeString.startsWith("image")) return MediaType.PICTURE;
  if (typeString.startsWith("video")) return MediaType.VIDEO;
  return MediaType.UNKNOWN;
};

const MediaSidebar: React.FC<Props> = (props) => {
  const { highlightedMedia, userId, children } = props;
  const [addMediaValues, setAddMediaValues] = useState<
    AddMediaDialogProps["initialMedia"]
  >([]);
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
        <AddMediaModal fullWidth maxWidth="lg">
          <AddMediaDialog
            cancelHandler={closeAddMedia}
            initialMedia={addMediaValues}
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
          onDrop={(acceptedFiles: (File & { path?: string })[]) => {
            console.log(acceptedFiles);
            const mediaArr: typeof addMediaValues = [];

            for (const f of acceptedFiles) {
              mediaArr.push({
                URL: f.path || f.name,
                Name: f.name,
                Type: decideMediaType(f.type),
                "Is Local": true,
              });
            }

            setAddMediaValues(mediaArr);
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
