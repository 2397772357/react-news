import React from "react";
import SideMenu from "../../components/SideMenu/SideMenu";
import TopHeader from "../../components/TopHeader/TopHeader";
import { Layout, theme } from "antd";
import { connect } from "react-redux";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import "./newssandbox.css";
const { Content } = Layout;

function NewsSandBox(props) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout
        className="site-layout"
        style={{
          marginLeft: props.isCollapsed ? "70px" : "200px",
        }}
      >
        <TopHeader></TopHeader>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            overflow: "auto",
          }}
        >
          <Suspense fallback={<h2>Loading..</h2>}>
            <Outlet></Outlet>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed,
  };
};

export default connect(mapStateToProps)(NewsSandBox);
