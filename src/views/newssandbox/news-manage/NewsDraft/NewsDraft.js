import { Table, Button, Modal ,notification} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { confirm } = Modal;

export default function NewsDraft() {
  const [dataSource, setdataSource] = useState([]);
  const navigate = useNavigate();
  const { username } = JSON.parse(localStorage.getItem("token"));
  const getNewsList = async () => {
    const { data } = await axios.get(
      `http://localhost:8000/news?author=${username}&auditState=0&_expand=category`
    );
    setdataSource([...data]);
  };
  useEffect(() => {
    getNewsList();
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
      `http://localhost:8000/news/${item.id}`
    );
    getNewsList();
  };
  const handleCheck = (id) => {
    axios
      .patch(`http://localhost:8000/news/${id}`, { auditState: 1 })
      .then((res) => {
        navigate("/audit-manage/list");
        notification.info({
          message: `通知`,
          description: `您可以到审核列表中查看您的新闻`,
          placement: "bottomRight",
        });
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render(id) {
        return <b>{id}</b>;
      },
    },
    {
      title: "新闻标题",
      dataIndex: "title",
      render(title, item) {
        return <a href={`preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "分类",
      dataIndex: "category",
      render(category) {
        return category.title;
      },
    },
    {
      title: "操作",
      render(item) {
        return (
          <div>
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                navigate(`/news-manage/update/${item.id}`);
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
            <Button
              type="primary"
              shape="circle"
              icon={<UploadOutlined />}
              onClick={() => {
                handleCheck(item.id);
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
    </div>
  );
}
