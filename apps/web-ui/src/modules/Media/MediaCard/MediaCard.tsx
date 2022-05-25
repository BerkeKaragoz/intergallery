import { MediaDTO, MediaType } from "@/modules/Media/utils";
import { getMediaSourceThumb } from "@/modules/Source";
import React from "react";
import {
  MCContainer,
  MCImg,
  MCLink,
  MCSource,
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

    const MediaSrcComponent = React.useMemo(() => {
      switch (media.type) {
        case MediaType.VIDEO:
        case MediaType.PICTURE: {
          return (
            <MCImg
              src={getMediaSourceThumb(media.sourceIds[0])}
              alt={media.name}
              loading="lazy"
              referrerPolicy="same-origin"
            />
          );
        }
        default:
          return <MCSource>{media.name}</MCSource>;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mediaType]);

    return (
      <MCContainer ref={forwardRef} {...rest}>
        <MCLink
          href={`/media/${media.id}`}
          underline="hover"
          data-testid={`media-card-${media.id}`}
        >
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
