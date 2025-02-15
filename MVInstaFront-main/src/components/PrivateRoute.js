import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ element: Component }) => {
  // const token = sessionStorage.getItem("token");
  const token  = Cookies.get('token');

  return token ? <Component /> : <Navigate to="/" />;
};

export default PrivateRoute;
