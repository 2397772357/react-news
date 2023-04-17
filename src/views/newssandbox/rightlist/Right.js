import { Table, Tag, Button, Modal, Popover, Switch } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
const { confirm } = Modal;

export default function Right() {
  const [dataSource, setdataSource] = useState([]);
  const getRightList = async () => {
    const { data } = await axios.get(
      "http://localhost:8000/rights?_embed=children"
    );
    data.map((item) => {
      if (item.children.length === 0) item.children = "";
    });
    setdataSource([...data]);
  };
  useEffect(() => {
    getRightList();
  }, []);
  const confirmMessage = (item) => {
    confirm({
      title: "你确定要删除吗?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        deletMethon(item);
      }
    });
  };
  const deletMethon = async (item) => {
    if (item.grade === 1) {
      const { data } = await axios.delete(
        `http://localhost:8000/rights/${item.id}`
      );
      getRightList();
    } else {
      const { data } = await axios.delete(
        `http://localhost:8000/children/${item.id}`
      );
      getRightList();
    }
  };
  const changeSwitch = async (item)=>{
    let pagepermission = item.pagepermission === 1? 0:1
    if (item.grade === 1) {
      const { data } = await axios.patch(
        `http://localhost:8000/rights/${item.id}`,
        {pagepermission}
      );
      getRightList();
    } else {
      const { data } = await axios.patch(
        `http://localhost:8000/children/${item.id}`,
        {pagepermission}
      );
      getRightList();
    }
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render(id) {
        return <b>{id}</b>;
      },
    },
    {
      title: "权限名称",
      dataIndex: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      render(key) {
        return <Tag color="orange">{key}</Tag>;
      },
    },
    {
      title: "操作",
      render(item) {
        return (
          <div>
            <Popover
              content={
                <div style={{ textAlign: "center" }}>
                  <Switch checked={item.pagepermission} onChange={()=>{changeSwitch(item)}}></Switch>
                </div>
              }
              title="页面配置项"
              trigger={(item.pagepermission === undefined || item.key === '/right-manage' || item.key === '/right-manage/right/list') ? "" : "click"}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                disabled={item.pagepermission === undefined || item.key === '/right-manage'|| item.key === '/right-manage/right/list'}
              />
            </Popover>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => {
                confirmMessage(item);
              }}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 7 }}
      />
    </div>
  );
}
