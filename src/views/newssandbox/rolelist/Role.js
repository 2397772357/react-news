import { Table, Button, Modal ,Tree} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
const { confirm } = Modal;

export default function Role() {
  const [dataSource, setdataSource] = useState([]);
  const [currentRights, setCurrentRights] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rightList, setRightList] = useState([]);
  
  const getRoleList = async () => {
    const { data } = await axios.get("http://localhost:8000/roles");
    setdataSource([...data]);
  };
  const getRightList = async () => {
    const { data } = await axios.get(
      "http://localhost:8000/rights?_embed=children"
    );
    data.map((item) => {
      if (item.children.length === 0) item.children = "";
    });
    setRightList([...data]);
  };
  useEffect(() => {
    getRoleList();
    getRightList();
  }, []);
  const confirmMessage = (item) => {
    confirm({
      title: "你确定要删除吗?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        deletMethon(item);
      },
    });
  };
  const deletMethon = async (item) => {
    const { data } = await axios.delete(
      `http://localhost:8000/roles/${item.id}`
    );
    getRoleList();
  };
  const handleOk = async() => {
    await axios.patch(
      `http://localhost:8000/roles/${currentId}`,{
        rights:currentRights
      }
    );
    setIsModalOpen(false);
    getRoleList();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onCheck = async (checkKeys)=>{
    setCurrentRights(checkKeys.checked)
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
      title: "角色名称",
      dataIndex: "roleName",
    },
    {
      title: "操作",
      render(item) {
        return (
          <div>
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setIsModalOpen(true);
                setCurrentRights([...item.rights])
                setCurrentId(item.id)
              }}
            />
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
        rowKey={(item) => item.id}
      />
      <Modal
        title="权限分配"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          className="draggable-tree"
          checkable
          treeData={rightList}
          checkedKeys = {currentRights}
          onCheck = {onCheck}
          checkStrictly
        />
      </Modal>
    </div>
  );
}
