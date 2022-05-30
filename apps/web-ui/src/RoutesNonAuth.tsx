import React from "react"
import { Navigate, Route, Routes } from "react-router"
import { RoutesProps } from "react-router-dom"
import AuthPage from "@/modules/Auth"

type Props = {
   location?: RoutesProps["location"]
}

const RoutesNonAuth = ({ location }: Props) => (
   <Routes>
      <Route
         index
         element={
            <Navigate
               to={{ pathname: "/auth", search: location?.search?.toString() }}
               replace={true}
            />
         }
      />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/test" element={<h1>Testing Page</h1>} />
      <Route
         path="*"
         element={
            <h1>
               404 Not Found
               <br />
               <a href="/">Home</a>
            </h1>
         }
      />
   </Routes>
)

export default RoutesNonAuth
