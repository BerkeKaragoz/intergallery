import MediaCard from "@/modules/Media/MediaCard";
import { SIDEBAR_WIDTH } from "@/modules/Media/MediaSidebar/MediaSidebar";
import { MediaDTO } from "@/modules/Media/utils";
import { styled } from "@mui/material";
import React from "react";

const minMediaWidth = 150; //TODO

const MediaContainer = styled("div")`
  width: 100%;
`;

const MediaUl = styled("ul")`
  display: grid;
  padding: 0px;
  margin: 1rem 0;
  list-style: none;
  grid-template-columns: repeat(auto-fit, minmax(${minMediaWidth}px, 1fr));
  grid-auto-rows: minmax(100px, calc(${minMediaWidth}px + 2rem));
  gap: 1rem;

  /* If wider than 5 media + sidebar + gaps */
  @media screen and (min-width: ${minMediaWidth * 6 + SIDEBAR_WIDTH}px) {
    grid-template-columns: repeat(5, minmax(${minMediaWidth}px, 1fr));
    grid-auto-rows: minmax(calc(${minMediaWidth}px + 2rem), 11vw);
  }
  /* If wider than app-container */
  @media screen and (min-width: ${(m) => m.theme.breakpoints.values.xl}px) {
    grid-auto-rows: ${(m) => m.theme.breakpoints.values.xl * 0.12}px;
  }
`;

type Props = React.HTMLAttributes<HTMLDivElement> & {
  mediaList: MediaDTO[];
  highlightHandler?: (media: MediaDTO) => void;
};

const MediaGrid: React.FC<Props> = (props) => {
  const { mediaList, highlightHandler = () => {}, ...rest } = props;
  const [highlightedId, setHighlightedId] = React.useState("");

  const onHighlight = (item: MediaDTO) => () => {
    highlightHandler(item);
    setHighlightedId(item.id);
  };

  return (
    <MediaContainer {...rest}>
      <MediaUl>
        {mediaList.map((item) => (
          <li key={item.id}>
            <MediaCard
              media={item}
              onFocus={onHighlight(item)}
              onPointerEnter={onHighlight(item)}
              className={highlightedId === item.id ? "_isHighlighted" : ""}
            />
          </li>
        ))}
      </MediaUl>
    </MediaContainer>
  );
};

export default MediaGrid;
export type { Props as MediaGridProps };
