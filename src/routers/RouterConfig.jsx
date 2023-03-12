import React from "react";
import Loadable from "react-loadable";
import { useRoutes } from "react-router-dom";

const LoadingTip = () => <div>加载路由ing...</div>;

const Login = Loadable({
  loader: () => import("./Login"),
  loading: LoadingTip,
});

const Home = Loadable({
  loader: () => import("./Home"),
  loading: LoadingTip,
});

const Welcome = Loadable({
  loader: () => import("./Home/Welcome"),
  loading: LoadingTip,
});

const PermissionList = Loadable({
  loader: () => import("./Home/Permisssion/PermissionList"),
  loading: LoadingTip,
});

const Role = Loadable({
  loader: () => import("./Home/Permisssion/Role"),
  loading: LoadingTip,
});

const User = Loadable({
  loader: () => import("./Home/User"),
  loading: LoadingTip,
});

const Chart = Loadable({
  loader: () => import("./Home/Business/Chart"),
  loading: LoadingTip,
});

const Goods = Loadable({
  loader: () => import("./Home/Business/Goods"),
  loading: LoadingTip,
});

const Order = Loadable({
  loader: () => import("./Home/Business/Order"),
  loading: LoadingTip,
});

const RouterConfig = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/home",
      element: <Home />,
      children: [
        { path: "/home/welcome", element: <Welcome /> },
        { path: "/home/permissionlist", element: <PermissionList /> },
        { path: "/home/role", element: <Role /> },
        { path: "/home/user", element: <User /> },
        { path: "/home/goods", element: <Goods /> },
        { path: "/home/chart", element: <Chart /> },
        { path: "/home/order", element: <Order /> },
      ],
    },
  ]);
  return routes;
};

export default RouterConfig;
