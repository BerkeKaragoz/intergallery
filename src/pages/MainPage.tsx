import Image from "@/components/Image";
import Page from "@/components/Page";
import useQuery from "@/hooks/useQuery";
import { API_BASE_URL } from "@/lib/api";
import { MediaDTO } from "@/lib/Media";
import { GetMediaInputDTO } from "@/lib/Media/media";
import MediaSidebar from "@/lib/Media/MediaSidebar";
import { createQuery } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { mediaApiSlice } from "@/redux/slice/mediaApiSlice";
import {
  CircularProgress,
  FormControl,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputLabel,
  LinearProgress,
  MenuItem,
  Pagination,
  Paper,
  Select,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";

const DEFAULT_PERPAGE = 20;
const DEFAULT_PAGE = 1;

const MainPage = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [mediaPage, setMediaPage] = useState<GetMediaInputDTO["page"]>(
    +(query.get("page") ?? DEFAULT_PAGE),
  );
  const [mediaPerPage, setMediaPerPage] = useState<GetMediaInputDTO["perPage"]>(
    +(query.get("perPage") ?? DEFAULT_PERPAGE),
  );

  const isFirstRender = useRef(true);
  const { data: mediaFetchData, isLoading: isMediaLoading } =
    mediaApiSlice.useGetMediaQuery({
      page: mediaPage,
      perPage: mediaPerPage,
    });
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [highlightedMedia, setHighlightedMedia] =
    React.useState<MediaDTO | null>(null);

  const highlightHandler = (item: MediaDTO) => () => {
    setHighlightedMedia(item);
  };

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setMediaPage(+(query.get("page") ?? DEFAULT_PAGE));
    setMediaPerPage(+(query.get("perPage") ?? DEFAULT_PERPAGE));
  }, [query]);

  React.useEffect(() => {
    //console.log({ media });
    if (mediaFetchData) {
      setMediaPage(mediaFetchData.page);
      setMediaPerPage(mediaFetchData.perPage);
    }
  }, [mediaFetchData]);

  // TODO validate page
  React.useEffect(() => {
    navigate(
      {
        search: createQuery<keyof GetMediaInputDTO>(
          ["page", mediaPage, mediaPage !== DEFAULT_PAGE],
          ["perPage", mediaPerPage, mediaPerPage !== DEFAULT_PERPAGE],
        ),
      },
      { replace: true },
    );
  }, [mediaPage, mediaPerPage, navigate]);

  return (
    <Page
      sidebar={
        <MediaSidebar
          userId={userState.data.id}
          highlightedMedia={highlightedMedia}
        >
          <Box sx={{ textAlign: "end" }}>
            <InputLabel id="sidebar-per-page-label" sx={{ fontSize: "small" }}>
              Per Page
            </InputLabel>
            <FormControl>
              <Select
                labelId="sidebar-per-page-label"
                id="sidebar-per-page"
                variant="standard"
                value={mediaPerPage}
                label="Per Page"
                onChange={({ target }) => {
                  if (target.value && target.value !== mediaPerPage)
                    setMediaPerPage(target.value as number); // value is controlled
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </MediaSidebar>
      }
    >
      {isMediaLoading ? (
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        mediaFetchData && (
          <ImageList variant="quilted" cols={5} rowHeight={256} gap={16}>
            {mediaFetchData.data.map((item) => (
              <ImageListItem
                key={item.id}
                component={Paper}
                variant={
                  highlightedMedia?.id === item.id ? "outlined" : "elevation"
                }
                onFocus={highlightHandler(item)}
                onPointerEnter={highlightHandler(item)}
                sx={{ borderRadius: 2, overflow: "hidden" }}
              >
                <a
                  href={`${API_BASE_URL}/media/source/${item.sourceIds[0]}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={`${API_BASE_URL}/media/source/${item.sourceIds[0]}`}
                    alt={item.name}
                    loading="lazy"
                  />
                  <ImageListItemBar title={item.name} subtitle={item.id} />
                </a>
              </ImageListItem>
            ))}
          </ImageList>
        )
      )}

      <LinearProgress
        variant="determinate"
        sx={{ height: "1px", width: "128px", mx: "auto", my: 2 }}
        value={
          mediaFetchData && mediaPage
            ? (mediaPage / mediaFetchData.totalPages) * 100
            : 0
        }
      />

      <Pagination
        shape="rounded"
        count={mediaFetchData?.totalPages}
        page={mediaPage}
        sx={{ display: "flex", justifyContent: "center" }}
        onChange={(_, p) => {
          setMediaPage(p);
        }}
      />
    </Page>
  );
};

export default MainPage;
