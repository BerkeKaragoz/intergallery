import Image from "@/components/Image";
import Page from "@/components/Page";
import useQuery from "@/hooks/useQuery";
import { API_BASE_URL } from "@/lib/api";
import { MediaDTO } from "@/lib/Media";
import { GetMediaInputDTO } from "@/lib/Media/media";
import MediaSidebar from "@/lib/Media/MediaSidebar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { mediaApiSlice } from "@/redux/slice/mediaApiSlice";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  LinearProgress,
  Pagination,
  Paper,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { createSearchParams } from "react-router-dom";

const DEFAULT_PERPAGE = 20;
const DEFAULT_PAGE = 1;

const MainPage = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [mediaPerPage, setMediaPerPage] = useState<GetMediaInputDTO["perPage"]>(
    +(query.get("perPage") ?? DEFAULT_PERPAGE),
  );
  const [mediaPage, setMediaPage] = useState<GetMediaInputDTO["page"]>(
    +(query.get("page") ?? DEFAULT_PAGE),
  );
  const [mediaTotalPage, setMediaTotalPage] = useState<number | undefined>(
    undefined,
  );

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
    //console.log({ media });
    if (mediaFetchData) {
      setMediaTotalPage(mediaFetchData.totalPages);
      setMediaPage(mediaFetchData.page);
      setMediaPerPage(mediaFetchData.perPage);
    }
  }, [mediaFetchData]);

  React.useEffect(() => {
    const mediaParams: GetMediaInputDTO = {
      perPage: mediaPerPage,
      page: mediaPage,
    };

    navigate(
      {
        search: `?${createSearchParams({
          ...(mediaParams.page !== DEFAULT_PAGE
            ? { page: `${mediaParams.page}` }
            : {}),
          ...(mediaParams.perPage !== DEFAULT_PERPAGE
            ? { perPage: `${mediaParams.perPage}` }
            : {}),
        } as Record<keyof GetMediaInputDTO, string>)}`,
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
        />
      }
    >
      {isMediaLoading ? (
        <LinearProgress color="secondary" />
      ) : (
        mediaFetchData && (
          <ImageList variant="quilted" cols={5} rowHeight={256} gap={16}>
            {mediaFetchData.data.map((item) => (
              <ImageListItem
                key={item.id}
                component={Paper}
                variant="outlined"
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

      <Pagination
        shape="rounded"
        count={mediaTotalPage}
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
