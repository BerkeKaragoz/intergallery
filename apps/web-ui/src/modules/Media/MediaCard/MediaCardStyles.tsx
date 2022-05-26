import { Link, styled } from "@mui/material";

const subtitleHeight = 2.4; // rem

export const MCContainer = styled("div")`
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: ${(m) => m.theme.shape.borderRadius}px;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0);

  box-sizing: border-box;

  &._isHighlighted {
    border-color: rgba(255, 255, 255, 0.2);
  }

  &:hover,
  &:focus-within {
    border-color: rgba(255, 255, 255, 0.4);
  }
`;

export const MCLink = styled(Link)`
  display: flex;
  height: inherit;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  color: inherit;
`;

export const MCSource = styled("div")`
  display: inline-block;
  overflow: hidden;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${(m) => m.theme.shape.borderRadius}px;
  /*margin-bottom: calc(${subtitleHeight}rem + 4px);*/
  flex-shrink: 0;
  object-position: center 16.666%;
  user-select: none;
  text-decoration: none;
`;

export const MCImg = MCSource.withComponent("img");
export const MCVideo = MCSource.withComponent("video");

export const MCSubtitleContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-end;
  flex-shrink: 0;

  position: relative;
  bottom: ${subtitleHeight + subtitleHeight * 0.5}rem;
  margin-bottom: ${-subtitleHeight - subtitleHeight * 0.5}rem;
  max-height: ${subtitleHeight + subtitleHeight * 0.5}rem;
  overflow: hidden;

  padding-top: 0.55rem;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.4) 60%,
    rgba(0, 0, 0, 0) 100%
  );
`;

export const MCSubtitle = styled("span")`
  width: inherit;
  line-height: ${subtitleHeight * 0.5}rem;
  font-size: small;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-wrap: break-word;
  padding: ${(m) => m.theme.spacing(1)};
  text-shadow: 0px 1px 3px #202;
`;
