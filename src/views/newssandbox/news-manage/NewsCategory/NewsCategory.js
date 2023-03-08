import { Table, Button, Modal, Form, Input } from "antd";
import axios from "axios";
import React, { useEffect, useState, useRef, useContext } from "react";
import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

export default function NewsCategory() {
  const [dataSource, setdataSource] = useState([]);
  const EditableContext = React.createContext(null);
  const getCategoryList = async () => {
    const { data } = await axios.get("http://localhost:8000/categories");
    setdataSource([...data]);
  };
  useEffect(() => {
    getCategoryList();
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
      `http://localhost:8000/categories/${item.id}`
    );
    getCategoryList();
  };
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };
  const handleSave = async (record) => {
    const { data } = await axios.patch(
      `http://localhost:8000/categories/${record.id}`,
      { title: record.title, value: record.title }
    );
    getCategoryList();
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
      title: "栏目名称",
      dataIndex: "title",
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "title",
        title: "栏目名称",
        handleSave,
      }),
    },
    {
      title: "操作",
      render(item) {
        return (
          <div>
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
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
      />
    </div>
  );
}
