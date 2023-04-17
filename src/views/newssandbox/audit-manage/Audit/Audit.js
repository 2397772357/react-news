import { Button, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
export default function Audit() {
  const [auditList, setAuditList] = useState([]);
  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );
  useEffect(() => {
    getAuditList();
  }, []);
  const getAuditList = async () => {
    const { data } = await axios.get(
      `http://localhost:8000/news?auditState=1&_expand=category`
    );
    setAuditList(
      roleId === 1
        ? [...data]
        : [
            ...data.filter((item) => item.author === username),
            ...data.filter(
              (item) => item.region === region && item.roleId == 3
            ),
          ]
    );
  };
  const handleAudit = (item, auditState, publishState) => {
    axios.patch(`http://localhost:8000/news/${item.id}`, {
      auditState,
      publishState,
    });
    setAuditList(auditList.filter(data=>data.id!==item.id))
  };
  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      render(title, item) {
        return <a href={`/news-manage/preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render(category) {
        return <div>{category.title}</div>;
      },
    },
    {
      title: "操作",
      render(item) {
        return (
          <div>
            <Button
              type="primary"
              onClick={() => {
                handleAudit(item, 2, 1);
              }}
            >
              通过
            </Button>
            <Button
              danger
              onClick={() => {
                handleAudit(item, 3, 0);
              }}
            >
              驳回
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Table
        dataSource={auditList}
        columns={columns}
        pagination={{ pageSize: 7 }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
