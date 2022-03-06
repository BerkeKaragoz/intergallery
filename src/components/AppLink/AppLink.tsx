import * as React from "react";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";

type Props = Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] };

// You don't need to use this one as it just replaces the components in the theme
const AppLink = React.forwardRef<any, Props>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return (
    <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />
  );
});

export type { Props as AppLinkProps };
export default AppLink;
