import Image from "@/components/Image";
import Page from "@/components/Page";
import useQuery from "@/hooks/useQuery";
import { API_BASE_URL } from "@/lib/api";
import { MediaDTO } from "@/lib/Media";
import { GetMediaInputDTO } from "@/lib/Media/media";
import MediaSidebar from "@/lib/Media/MediaSidebar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetMediaQuery } from "@/redux/slice/apiSlice";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Pagination,
  Paper,
} from "@mui/material";
import React from "react";

const MainPage = () => {
  const query = useQuery();
  const getMediaParams: GetMediaInputDTO = {
    perPage: +(query.get("perPage") ?? 20),
    page: +(query.get("page") ?? 1),
  };
  const { data, isLoading, isSuccess, isError, error, refetch } =
    useGetMediaQuery(getMediaParams, {});
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [highlightedMedia, setHighlightedMedia] =
    React.useState<MediaDTO | null>(null);

  const highlightHandler = (item: MediaDTO) => () => {
    setHighlightedMedia(item);
  };

  return (
    <Page
      sidebar={
        <MediaSidebar
          userId={userState.data.id}
          highlightedMedia={highlightedMedia}
        />
      }
    >
      <ImageList variant="quilted" cols={5} rowHeight={256} gap={16}>
        {data && Array.isArray(data.data) ? (
          data.data.map((item) => (
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
          ))
        ) : (
          <p>Empty.</p>
        )}
      </ImageList>

      <Pagination count={10} />
      <details>
        <pre>{JSON.stringify(userState, null, 2)}</pre>
      </details>
      <details>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </details>
    </Page>
  );
};

export default MainPage;
