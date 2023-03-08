import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SideMenu.css";
import { connect } from "react-redux";
const { Sider } = Layout;

function SideMenu(props) {
  let navigate = useNavigate();
  let location = useLocation();
  const selectKeys = [location.pathname]; // ex: ['/home']
  const openKeys = ["/" + location.pathname.split("/")[1]];
  const [menu, setMenu] = useState([]);
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));
  const clickMenu = (e) => {
    navigate(e.key);
  };
  const getMenuList = async () => {
    const { data } = await axios.get(
      "http://localhost:8000/rights?_embed=children"
    );
    let menu = [];
    menu = data.filter((item) => {
      item.label = item.title;
      item.children = item.children.filter((item) => {
        if (item.pagepermission === 1 && rights.includes(item.key)) {
          item.label = item.title;
          return true;
        }
      });
      if (item.children.length === 0) item.children = undefined;
      if (item.pagepermission === 1 && rights.includes(item.key)) return true;
    });
    setMenu([...menu]);
  };
  useEffect(() => {
    getMenuList();
  }, []);
  return (
    <div>
      <Sider
        trigger={null}
        collapsible
        collapsed={props.isCollapsed}
        style={{
          height: "100vh",
          overflow: "scroll",
          position: 'fixed',
        }}
      >
        <div className="logo">大学生新闻管理系统</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectKeys}
          defaultOpenKeys={openKeys}
          items={menu}
          onClick={clickMenu}
        />
      </Sider>
    </div>
  );
}


const mapStateToProps = ({CollapsedReducer:{isCollapsed}})=>{
  return {
    isCollapsed
  }
}

export default connect(mapStateToProps)(SideMenu);
