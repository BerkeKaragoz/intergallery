import React from "react";
import { Route, Routes } from "react-router";
import { Navigate } from "react-router-dom";
import MainPage from "./pages";

const RoutesAuth = () => (
  <Routes>
    <Route index element={<MainPage />} />

    <Route path="/auth" element={<Navigate to="/" />} />
    <Route path="*" element={<h1>404 Not Found</h1>} />
  </Routes>
);

export default RoutesAuth;
