import AppDropzone from "@/components/AppDropzone";
import useAppModal from "@/hooks/useAppModal";
import { MediaDTO, MediaType } from "@/modules/Media";
import { sortAlphaNum } from "@/lib/utils";
import AddMediaDialog, {
  AddMediaDialogProps,
} from "@/modules/Media/AddMediaDialog";
import { UserState } from "@/redux/slice/userSlice";
import {
  Button,
  Divider,
  Drawer,
  DrawerProps,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
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

const decideMediaType = (typeString = "") => {
  if (typeString.startsWith("image")) return MediaType.PICTURE;
  if (typeString.startsWith("video")) return MediaType.VIDEO;
  return MediaType.UNKNOWN;
};

export const SIDEBAR_BREAKPOINT = "sm";
export const SIDEBAR_SMALL_BREAKPOINT = "md";

export const SIDEBAR_WIDTH = 256;
export const SIDEBAR_SMALL_WIDTH = 196;

type Props = {
  open?: DrawerProps["open"];
  highlightedMedia?: MediaDTO | null;
  userId?: UserState["data"]["id"];
};

const MediaSidebar: React.FC<Props> = (props) => {
  const { open, highlightedMedia, userId, children } = props;

  const [AddMediaModal, openAddMedia, closeAddMedia] = useAppModal();

  const matchesSidebar = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up(SIDEBAR_BREAKPOINT),
  );

  const matchesSidebarSmall = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up(SIDEBAR_SMALL_BREAKPOINT),
  );

  const [addMediaValues, setAddMediaValues] = useState<
    AddMediaDialogProps["initialMedia"]
  >([]);

  const handleOnDrop = (acceptedFiles: (File & { path?: string })[]) => {
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

    mediaArr.sort((a, b) => sortAlphaNum(a.Name, b.Name));

    setAddMediaValues(mediaArr);
    openAddMedia();
  };

  return (
    <Drawer
      variant={matchesSidebar ? "permanent" : "temporary"}
      open={open}
      sx={
        matchesSidebar
          ? {
              [`& .MuiDrawer-paper`]: {
                position: "static",
                background: "inherit",
                flexDirection: "row",
                border: "none",
              },
            }
          : {}
      }
    >
      <Box
        component="aside"
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          mx: 2,
          pb: 2,
          width: matchesSidebarSmall ? SIDEBAR_WIDTH : SIDEBAR_SMALL_WIDTH,
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
        <AppDropzone onDrop={handleOnDrop} />

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
    </Drawer>
  );
};

export type { Props as MediaSidebarProps };
export default MediaSidebar;
