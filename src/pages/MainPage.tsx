import BrowseSidebar from "@/components/BrowseSidebar";
import Image from "@/components/Image";
import Page from "@/components/Page";
import { API_BASE_URL } from "@/lib/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetMediaQuery } from "@/redux/slice/apiSlice";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Paper,
} from "@mui/material";
import React from "react";

const MainPage = () => {
  const { data, isLoading, isSuccess, isError, error, refetch } =
    useGetMediaQuery({}, {});
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [highlightedMedia, setHighlightedMedia] = React.useState<any>({});

  const highlightHandler = (item: any) => () => {
    setHighlightedMedia(item);
  };

  return (
    <Page sidebar={<BrowseSidebar highlightedMedia={highlightedMedia} />}>
      <ImageList variant="quilted" cols={5} rowHeight={256} gap={16}>
        {Array.isArray(data?.data) &&
          data.data.map((item: any) => (
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
