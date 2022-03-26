import React from "react";
import { Route, Routes, RoutesProps } from "react-router";
import { Navigate } from "react-router-dom";
import MainPage from "./pages";
import MediaPage from "./pages/media/Media";

type Props = {
  location?: RoutesProps["location"];
};

const RoutesAuth = ({ location }: Props) => (
  <Routes>
    <Route index element={<MainPage />} />
    <Route path="/media/:mediaId" element={<MediaPage />} />

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
