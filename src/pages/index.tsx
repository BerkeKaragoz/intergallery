import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchGetUser, fetchLoginUser } from "@/redux/slice/userSlice";
import Header from "@/components/Header";
import { useGetMediaQuery } from "@/redux/slice/apiSlice";
import {
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  LinearProgress,
  Paper,
} from "@mui/material";
import { API_BASE_URL } from "@/lib/api";
import Image from "@/components/Image";
import Main from "@/components/Main";
import { Navigate, Outlet, Route, Routes } from "react-router";
import AuthPage from "./auth";
import Footer from "@/components/Footer";

export const AuthenticatedContainer: React.FC<{}> = (props) => {
  const { children } = props;
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    try {
      const lastLoginData = JSON.parse(
        window.localStorage.getItem("lastLogin") ?? "{}",
      );

      //TODO remove the item when logging out

      if (lastLoginData["id"]) dispatch(fetchGetUser());
    } catch (ex) {}
  }, []);

  if (userState.isLoading) return <LinearProgress />;

  return (
    <>
      <Routes>
        {userState.data.id ? (
          <Route
            element={
              <>
                <Header user={userState.data} />
                <Outlet />
                <Footer />
              </>
            }
          >
            <Route index element={<MainPage />} />
            <Route path="/auth" element={<Navigate to="/" />} />
          </Route>
        ) : (
          <>
            <Route index element={<Navigate to="/auth" />} />
            <Route path="/auth" element={<AuthPage />}></Route>
          </>
        )}

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
};

export const MainPage = () => {
  const { data, isLoading, isSuccess, isError, error, refetch } =
    useGetMediaQuery({}, {});
  const userState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return (
    <Main>
      <ImageList variant="quilted" cols={5} rowHeight={256} gap={16}>
        {Array.isArray(data?.data) &&
          data.data.map((item: any) => (
            <ImageListItem
              key={item.id}
              component={Paper}
              variant="outlined"
              sx={{ borderRadius: 2, overflow: "hidden" }}
            >
              <a
                href={`${API_BASE_URL}/media/source/${item.sourceIds[0]}`}
                target="_blank"
                rel="noreferrer"
              >
                <Image
                  src={`${API_BASE_URL}/media/source/${item.sourceIds[0]}`}
                  alt={item.name}
                  loading="lazy"
                />
                <ImageListItemBar title={item.name} subtitle={item.id} />
              </a>
            </ImageListItem>
          ))}
      </ImageList>
      <pre>{JSON.stringify(userState, null, 2)}</pre>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Main>
  );
};

export default AuthenticatedContainer;
