import React from "react";
import { Navigate, Route, Routes } from "react-router";
import AuthPage from "./pages/auth";

const RoutesNonAuth = () => (
  <Routes>
    <Route index element={<Navigate to="/auth" />} />
    <Route path="/auth" element={<AuthPage />}></Route>
    <Route path="/test" element={<h1>Testing Page</h1>} />
    <Route path="*" element={<h1>404 Not Found, Not Expected</h1>} />
  </Routes>
);

export default RoutesNonAuth;
