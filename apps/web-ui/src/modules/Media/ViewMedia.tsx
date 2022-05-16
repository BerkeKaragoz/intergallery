import Image from "@/components/Image";
import Page from "@/components/Page";
import useAppModal from "@/hooks/useAppModal";
import useQuery from "@/hooks/useQuery";
import { createQuery } from "@/lib/utils";
import DeleteMediaDialog from "@/modules/Media/DeleteMediaDialog";
import EditMediaDialog from "@/modules/Media/EditMediaDialog";
import { MediaType } from "@/modules/Media/utils";
import { getMediaSource } from "@/modules/Source";
import { useGetMediaByIdQuery } from "@/redux/slice/mediaApiSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Grid, LinearProgress, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import React from "react";
import { useNavigate, useParams } from "react-router";

const MediaInfo = ({
  label,
  info,
}: {
  label?: React.ReactNode;
  info?: React.ReactNode;
}) => (
  <>
    <Typography variant="subtitle2" children={label} />
    <Typography variant="body2" children={info} mb={2} />
  </>
);

const Video = styled("video")`
  display: block;
  overflow: hidden;
  width: 100%;
  height: 100%;
  object-fit: cover;
  flex-shrink: 0;
  &::before {
    text-align: center;
    font-weight: lighter;
    font-size: large;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    text-shadow: 0 0 1.125rem #fff;
    line-height: initial;
  }
`;

const DEFAULT_SOURCE_INDEX = 0;

type Props = {};

const ViewMedia: React.FC<Props> = (props) => {
  const {} = props;
  const navigate = useNavigate();
  const query = useQuery();
  const { mediaId } = useParams();

  const [sourceIndex, setSourceIndex] = React.useState(
    Number(query.get("source") ?? DEFAULT_SOURCE_INDEX),
  );

  const [EditMediaModal, openEditMedia, closeEditMedia] = useAppModal();
  const [DeleteMediaModal, openDeleteMedia, closeDeleteMedia] = useAppModal();

  const { data, isLoading, isError } = useGetMediaByIdQuery(mediaId ?? "");

  const maxSourceId = data ? data.sourceIds.length - 1 : undefined;

  React.useEffect(() => {
    if (!maxSourceId) return;

    if (sourceIndex > maxSourceId) {
      const indexToSet = 0;
      navigate(
        {
          search: createQuery(["source", indexToSet]),
        },
        { replace: true },
      );
      setSourceIndex(indexToSet);
    }
  }, [maxSourceId, navigate, sourceIndex]);

  return (
    <Page>
      {isLoading && <LinearProgress />}
      {isError && <pre>{`Something went wrong.`}</pre>}
      {data && (
        <>
          <Box
            sx={{
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            {data.type !== MediaType.VIDEO ? (
              <Image
                src={getMediaSource(data.sourceIds[sourceIndex])}
                alt={data.name}
                sx={{
                  display: "flex",
                  maxHeight: "80vh",
                  minHeight: "512px",
                  height: "initial",
                  width: "initial",
                  maxWidth: "100%",
                  objectFit: "scale-down",
                  objectPosition: "center",
                  mx: "auto",
                }}
              />
            ) : (
              <Video
                src={getMediaSource(data.sourceIds[sourceIndex])}
                controls
                preload="metadata"
                //poster="thumbnailurl"
              />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                display: "inline-block",
                wordWrap: "break-word",
                my: 2,
                mr: 2,
                fontWeight: "medium",
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              {data.name}
            </Typography>
            <Button
              onClick={openEditMedia}
              color="secondary"
              variant="contained"
              endIcon={<EditIcon />}
            >
              Edit
            </Button>
          </Box>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={12} md={6}>
              <MediaInfo label="Type" info={MediaType[data.type]} />
            </Grid>
            <Grid item xs={12} md={6}>
              <MediaInfo
                label="Creation Date"
                info={new Date(data.creationDate).toString()}
              />
            </Grid>
            {data.updateDate !== data.creationDate && (
              <Grid item xs={12} md={6}>
                <MediaInfo
                  label="Last Update Date"
                  info={new Date(data.updateDate).toString()}
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <MediaInfo label="# of Sources" info={data.sourceIds.length} />
            </Grid>
            <Grid item xs={12} md={6}>
              <MediaInfo label="Owner ID" info={data.ownerId} />
            </Grid>
          </Grid>

          <Button
            onClick={openDeleteMedia}
            variant="outlined"
            endIcon={<DeleteIcon />}
            sx={{ mt: 4 }}
          >
            Delete
          </Button>

          <EditMediaModal fullWidth>
            <EditMediaDialog media={data} cancelHandler={closeEditMedia} />
          </EditMediaModal>

          <DeleteMediaModal>
            <DeleteMediaDialog media={data} cancelHandler={closeDeleteMedia} />
          </DeleteMediaModal>
        </>
      )}
    </Page>
  );
};

export type { Props as MediaPageProps };
export default ViewMedia;
