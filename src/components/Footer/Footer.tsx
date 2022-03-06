import { API_BASE_URL } from "@/lib/api";
import { useAppSelector } from "@/redux/hooks";
import React from "react";

const Footer = () => {
  const userState = useAppSelector((state) => state.user);

  return (
    <footer>
      <hr />
      {userState.data.id && <a href={API_BASE_URL + "/auth/logout"}>Logout</a>}
    </footer>
  );
};

export default Footer;
