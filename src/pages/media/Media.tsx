import Image from "@/components/Image";
import Page from "@/components/Page";
import { API_BASE_URL } from "@/lib/api";
import { useGetMediaByIdQuery } from "@/redux/slice/mediaApiSlice";
import { Grid, LinearProgress, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import React from "react";
import { useParams } from "react-router";
import { MediaType } from "@/lib/Media";

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

type Props = {};

const MediaPage: React.FC<Props> = (props) => {
  const {} = props;
  const { mediaId } = useParams();

  const { data, isLoading, isError } = useGetMediaByIdQuery(mediaId ?? "");

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
                src={`${API_BASE_URL}/media/source/${data.sourceIds[0]}`}
                alt={data.name}
                sx={{
                  display: "flex",
                  maxHeight: "80vh",
                  minHeight: "512px",
                  height: "initial",
                  width: "initial",
                  maxWidth: "100%",
                  objectFit: "scale-down",
                  mx: "auto",
                }}
              />
            ) : (
              <Video
                src={`${API_BASE_URL}/media/source/${data.sourceIds[0]}`}
                controls
                preload="metadata"
                //poster='thumbnailurl'
              />
            )}
          </Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              wordWrap: "break-word",
              my: 2,
              fontWeight: "medium",
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            {data.name}
          </Typography>
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
        </>
      )}
    </Page>
  );
};

export type { Props as MediaPageProps };
export default MediaPage;
