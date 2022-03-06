import { styled } from "@mui/system";

const Image = styled("img")`
  display: block;
  overflow: hidden;
  width: 100%;
  height: 100%;
  object-fit: cover;
  flex-shrink: 0;
  object-position: center 16.666%; //top portion of rule of thirds (6 vertical slices for css)
  user-select: none;
  text-align: center;
  font-weight: lighter;
  font-size: large;
  &::before {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    text-shadow: 0 0 1.125rem #fff;
    line-height: initial;
  }
`;

export default Image;
