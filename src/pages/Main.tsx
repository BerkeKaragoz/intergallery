import Image from "@/components/Image";
import Page from "@/components/Page";
import useQuery from "@/hooks/useQuery";
import { API_BASE_URL } from "@/lib/api";
import { MediaDTO } from "@/lib/Media";
import { GetMediaInputDTO } from "@/lib/Media/media";
import MediaSidebar, { SIDEBAR_BREAKPOINT } from "@/lib/Media/MediaSidebar";
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
  useMediaQuery,
} from "@mui/material";
import { Box, useTheme } from "@mui/system";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";

const DEFAULT_PERPAGE = 20;
const DEFAULT_PAGE = 1;

const MainPage = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const theme = useTheme();

  const matchesSidebar = useMediaQuery(
    theme.breakpoints.up(SIDEBAR_BREAKPOINT),
  );

  const matchesXs = useMediaQuery(theme.breakpoints.up("xs"));
  //const matchesSm = useMediaQuery(theme.breakpoints.up("sm"));
  const matchesMd = useMediaQuery(theme.breakpoints.up("md"));
  const matchesLg = useMediaQuery(theme.breakpoints.up("lg"));
  const matchesXl = useMediaQuery(theme.breakpoints.up("xl"));

  const [mediaPage, setMediaPage] = useState<GetMediaInputDTO["page"]>(
    +(query.get("page") ?? DEFAULT_PAGE),
  );
  const [mediaPerPage, setMediaPerPage] = useState<GetMediaInputDTO["perPage"]>(
    +(query.get("perPage") ?? DEFAULT_PERPAGE),
  );

  const [highlightedMedia, setHighlightedMedia] =
    React.useState<MediaDTO | null>(null);

  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const isFirstRender = useRef(true);

  const { data: mediaFetchData, isLoading: isMediaLoading } =
    mediaApiSlice.useGetMediaQuery({
      page: mediaPage,
      perPage: mediaPerPage,
    });

  const highlightHandler = (item: MediaDTO) => () => {
    if (!matchesSidebar) return; // if sidebar is shown
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
          open={matchesSidebar}
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
          <ImageList
            variant="quilted"
            cols={
              matchesXl ? 5 : matchesLg ? 4 : matchesMd ? 3 : matchesXs ? 2 : 1
            }
            rowHeight={256}
            gap={16}
            sx={{ mt: 0 }}
          >
            {mediaFetchData.data.map((item) => (
              <ImageListItem
                key={item.id}
                component={Paper}
                onFocus={highlightHandler(item)}
                onPointerEnter={highlightHandler(item)}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  outline:
                    highlightedMedia?.id === item.id ? "1px solid gray" : "",
                }}
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
