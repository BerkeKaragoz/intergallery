import { API_BASE_URL } from "@/lib/api";
import { MediaDTO, MediaType } from "@/modules/Media/utils";
import React from "react";
import {
  MCContainer,
  MCImg,
  MCLink,
  MCSource,
  MCVideo,
  MCSubtitle,
  MCSubtitleContainer,
} from "./MediaCardStyles";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  media: MediaDTO;
};

const MediaCard = React.forwardRef<HTMLDivElement, Props>(
  (props, forwardRef) => {
    const { media, ...rest } = props;
    const { type: mediaType } = media;
    const src = `${API_BASE_URL}/media/source/${media.sourceIds[0]}`;

    const MediaSrcComponent = React.useMemo(() => {
      switch (media.type) {
        case MediaType.VIDEO: {
          return (
            <MCVideo controls>
              <source src={src} />
            </MCVideo>
          );
        }
        case MediaType.PICTURE: {
          return (
            <MCImg
              src={src}
              alt={media.name}
              loading="lazy"
              referrerPolicy="same-origin"
            />
          );
        }
        default:
          return <MCSource>{media.sourceIds}</MCSource>;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mediaType]);

    return (
      <MCContainer ref={forwardRef} {...rest}>
        <MCLink href={`/media/${media.id}`} underline="hover">
          {MediaSrcComponent}
          <MCSubtitleContainer>
            <MCSubtitle>{media.name}</MCSubtitle>
          </MCSubtitleContainer>
        </MCLink>
      </MCContainer>
    );
  },
);

export default MediaCard;
export type { Props as MediaCardProps };
