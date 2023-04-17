import React from "react";
import { Layout, theme, Dropdown, Avatar } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
const { Header } = Layout;

function TopHeader(props) {
  let navigate = useNavigate();
  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem("token"));

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const ClickDrop = (e) => {
    if (e.key === "2") {
      navigate("/login");
    }
  };

  const changeCollapsed = () => {
    props.changeCollapsed();
  };

  const items = [
    {
      key: "1",
      label: roleName,
    },
    {
      key: "2",
      danger: true,
      label: "退出",
    },
  ];

  return (
    <Header
      style={{
        padding: "0 16px",
        background: colorBgContainer,
      }}
    >
      {props.isCollapsed ? (
        <MenuUnfoldOutlined onClick={changeCollapsed} />
      ) : (
        <MenuFoldOutlined onClick={changeCollapsed} />
      )}
      <div style={{ float: "right" }}>
        <span>欢迎{username}回来！</span>
        <Dropdown menu={{ items, onClick: ClickDrop }}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
}

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed,
  };
};

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: "change_collapsed",
    };
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader);
