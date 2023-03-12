import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button, Layout, Menu } from "antd";
import {
  SafetyOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  UserOutlined,
  IdcardOutlined,
  HddOutlined,
  TableOutlined,
  LineChartOutlined,
  UserAddOutlined,
  ShopOutlined,
} from "@ant-design/icons";

import "./index.less";

const { Header, Sider, Content } = Layout;

export default function Home() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!window.sessionStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const getItems = (key, icon, label, children) => {
    return {
      key,
      icon,
      label,
      children,
    };
  };

  const items = [
    getItems("1", <SafetyOutlined />, "权限管理", [
      getItems(
        "11",
        <UnorderedListOutlined />,
        <Link to="/home/permissionlist">权限列表</Link>
      ),
      getItems("12", <TeamOutlined />, <Link to="/home/role">角色管理</Link>),
    ]),
    getItems("2", <UserOutlined />, "用户管理", [
      getItems(
        "21",
        <UserAddOutlined />,
        <Link to="/home/user">用户列表</Link>
      ),
    ]),
    getItems("3", <IdcardOutlined />, "商品管理", [
      getItems("31", <HddOutlined />, <Link to="/home/goods">商品列表</Link>),
      getItems("32", <TableOutlined />, <Link to="/home/order">订单列表</Link>),
      getItems(
        "33",
        <LineChartOutlined />,
        <Link to="/home/chart">数据报表</Link>
      ),
    ]),
  ];

  return (
    <div>
      <Layout>
        <Sider
          style={{ height: "100vh" }}
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div
            className="logo"
            style={
              collapsed
                ? {
                    justifyContent: "center",
                  }
                : {}
            }
          >
            <ShopOutlined />
            <span
              style={
                collapsed
                  ? {
                      visibility: "hidden",
                      width: 0,
                      color: "transparent",
                    }
                  : {
                      marginLeft: 10,
                    }
              }
            >
              白菜的集市
            </span>
          </div>
          <Menu theme="dark" mode="inline" items={items} />
        </Sider>
        <Layout className="site-layout">
          <Header
            style={{
              padding: 0,
              background: "#ccc",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
            <Button
              onClick={() => {
                sessionStorage.removeItem("token");
                navigate("/login");
              }}
              style={{
                marginRight: 20,
              }}
              type="primary"
              danger
            >
              退出登录
            </Button>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: "#fff",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
