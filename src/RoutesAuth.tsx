import React from "react";
import { Route, Routes, RoutesProps } from "react-router";
import { Navigate } from "react-router-dom";
import Browse from "@/modules/Browse";
import Media from "@/modules/Media";

type Props = {
  location?: RoutesProps["location"];
};

const RoutesAuth = ({ location }: Props) => (
  <Routes>
    <Route index element={<Browse />} />
    <Route path="/media/:mediaId" element={<Media />} />

    <Route
      path="/auth"
      element={
        <Navigate
          to={{ pathname: "/", search: location?.search?.toString() }}
          replace={true}
        />
      }
    />
    <Route path="*" element={<h1>404 Not Found</h1>} />
  </Routes>
);

export default RoutesAuth;
