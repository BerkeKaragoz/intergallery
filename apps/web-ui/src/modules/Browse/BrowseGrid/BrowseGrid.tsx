import { SIDEBAR_WIDTH } from "@/modules/Browse/BrowseSidebar/BrowseSidebar";
import MediaCard from "@/modules/Media/MediaCard";
import { MediaDTO } from "@/modules/Media/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { Box, Checkbox, styled, Theme, Typography } from "@mui/material";
import { Field } from "formik";
import React from "react";

const minMediaWidth = 150; //TODO

const MediaContainer = styled("div")`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const MediaUl = styled("ul")`
  width: 100%;
  height: 100%;
  max-height: 80vh;
  overflow-y: scroll;
  box-sizing: content-box;

  padding: 0 17px 0 0;

  display: grid;
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
  showDeleteCheckboxes?: boolean;
};

const BrowseGrid: React.FC<Props> = (props) => {
  const {
    mediaList,
    highlightHandler = () => {},
    showDeleteCheckboxes = false,
    ...rest
  } = props;
  const [highlightedId, setHighlightedId] = React.useState("");

  const onHighlight = (item: MediaDTO) => () => {
    highlightHandler(item);
    setHighlightedId(item.id);
  };

  return (
    <MediaContainer {...rest}>
      <MediaUl data-testid="browse-grid">
        {mediaList.length > 0 ? (
          <>
            {mediaList.map((item, i) => (
              <Box component="li" key={item.id} sx={{ position: "relative" }}>
                {showDeleteCheckboxes && (
                  <Field
                    as={Checkbox}
                    value={item.id}
                    name="ids"
                    label="Select as to be deleted"
                    icon={<DeleteOutlinedIcon />}
                    checkedIcon={<DeleteIcon />}
                    centerRipple={false}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: "100%",
                      backgroundColor: "#0009",
                      borderRadius: ({ shape }: Theme) =>
                        shape.borderRadius + "px",
                      "& .MuiSvgIcon-root": {
                        fontSize: 36,
                        backgroundColor: "#0003",
                        borderRadius: "25%",
                      },
                    }}
                  />
                )}
                <MediaCard
                  media={item}
                  data-testid={`browse-card-${i}`}
                  onFocus={onHighlight(item)}
                  onPointerEnter={onHighlight(item)}
                  className={highlightedId === item.id ? "_isHighlighted" : ""}
                />
              </Box>
            ))}
          </>
        ) : (
          <Box component="li" sx={{ gridColumn: "1/-1" }}>
            <Typography
              m={4}
              variant="h4"
              component="p"
              align="center"
              sx={{ opacity: 0.2 }}
            >
              There isn't any media.
            </Typography>
          </Box>
        )}
      </MediaUl>
    </MediaContainer>
  );
};

export default BrowseGrid;
export type { Props as BrowseGridProps };
