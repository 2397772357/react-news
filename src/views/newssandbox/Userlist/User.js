import { Table, Button, Modal, Switch } from "antd";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import UserForm from "../../../components/user-form/UserForm";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
const { confirm } = Modal;

export default function User() {
  const [userList, setUserList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [isAddOpen, setisAddOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);
  const [current, setCurrent] = useState(null);
  const addForm = useRef(null);
  const updateForm = useRef(null);
  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );

  useEffect(() => {
    getUserList();
    getRoleList();
    getRegionList();
  }, []);

  const getUserList = async () => {
    const { data } = await axios.get(
      "http://localhost:8000/users?_expand=role"
    );
    setUserList(
      roleId === 1
        ? [...data]
        : [
            ...data.filter((item) => item.username === username),
            ...data.filter(
              (item) => item.region === region && item.roleId == 3
            ),
          ]
    );
  };

  const getRoleList = async () => {
    const { data } = await axios.get("http://localhost:8000/roles");
    data.map((item) => {
      item.label = item.roleName;
      item.value = item.id;
      item.key = item.id;
    });
    setRoleList([...data]);
  };

  const getRegionList = async () => {
    const { data } = await axios.get("http://localhost:8000/regions");
    data.map((item) => {
      item.label = item.title;
      item.text = item.title;
      item.key = item.id;
    });
    setRegionList([...data]);
  };

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
      `http://localhost:8000/users/${item.id}`
    );
    getUserList();
  };

  const handleCancel = () => {
    setisAddOpen(false);
  };

  const addFormOk = () => {
    addForm.current
      .validateFields()
      .then(async (value) => {
        setisAddOpen(false);
        addForm.current.resetFields();
        const { data } = await axios.post(`http://localhost:8000/users`, {
          ...value,
          roleState: true,
          dafault: false,
        });
        getUserList();
      })
      .catch(() => {
        console.log("error");
      });
  };

  const handleChange = async (item) => {
    const { data } = await axios.patch(
      `http://localhost:8000/users/${item.id}`,
      {
        roleState: !item.roleState,
      }
    );
    getUserList();
  };

  const handleUpdate = (item) => {
    if (item.roleId === 1) {
      setIsUpdateDisabled(true);
    } else {
      setIsUpdateDisabled(false);
    }
    setIsUpdateOpen(true);
    setTimeout(() => {
      updateForm.current.setFieldsValue(item);
    }, 0);
    setCurrent(item);
  };

  const handleUpdateCancel = () => {
    setIsUpdateOpen(false);
    setIsUpdateDisabled(!isUpdateDisabled);
  };

  const updateFormOk = () => {
    updateForm.current
      .validateFields()
      .then(async (value) => {
        setIsUpdateOpen(false);
        updateForm.current.resetFields();
        const { data } = await axios.patch(
          `http://localhost:8000/users/${current.id}`,
          {
            ...value,
          }
        );
        getUserList();
      })
      .catch(() => {
        console.log("error");
      });
    setIsUpdateDisabled(!isUpdateDisabled);
  };

  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      filters: [...regionList, { text: "全球", value: "全球" }],
      onFilter: (value, item) => {
        if (value === "全球") return item.region === "";
        return item.region === value;
      },
      render(region) {
        return <b>{region === "" ? "全球" : region}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render(role) {
        return role?.roleName;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      dataIndex: "roleState",
      render(roleState, item) {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onChange={() => {
              handleChange(item);
            }}
          ></Switch>
        );
      },
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
                handleUpdate(item);
              }}
              disabled={item.default}
            />
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              disabled={item.default}
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
      <Button type="primary" onClick={() => setisAddOpen(true)}>
        添加用户
      </Button>
      <Table
        dataSource={userList}
        columns={columns}
        pagination={{ pageSize: 7 }}
        rowKey={(item) => item.id}
      />
      <Modal
        title="添加用户信息"
        okText="确定"
        cancelText="取消"
        open={isAddOpen}
        onOk={() => {
          addFormOk();
        }}
        onCancel={handleCancel}
      >
        <UserForm
          roleList={roleList}
          regionList={regionList}
          ref={addForm}
        ></UserForm>
      </Modal>

      <Modal
        title="更新用户信息"
        okText="确定"
        cancelText="取消"
        open={isUpdateOpen}
        onOk={() => {
          updateFormOk();
        }}
        onCancel={handleUpdateCancel}
      >
        <UserForm
          roleList={roleList}
          regionList={regionList}
          ref={updateForm}
          isUpdateDisabled={isUpdateDisabled}
          isUpdate={true}
        ></UserForm>
      </Modal>
    </div>
  );
}
