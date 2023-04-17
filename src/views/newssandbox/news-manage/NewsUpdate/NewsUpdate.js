import React, { useState, useEffect, useRef ,} from "react";
import { Button, Steps, Form, Input, Select, message, notification } from "antd";
import style from "./NewUpdate.module.css";
import { useParams } from "react-router";
import axios from "axios";
import NewsEditor from "../../../../components/NewsEditor/NewsEditor";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@ant-design/pro-components";
const { Option } = Select;

export default function NewsUpdate() {
  const navigate = useNavigate();
  const params = useParams();
  const [current, setCurrent] = useState(0);
  const [category, setCategory] = useState([]);
  const [formInfo, setFormInfo] = useState({});
  const [content, setContent] = useState("");
  const NewsFrom = useRef(null);

  useEffect(() => {
    getCategory();
    getNewsInfo();
  }, []);
  const getNewsInfo = async () => {
    const { data } = await axios.get(
      `http://localhost:8000/news/${params.id}?_expand=category&_expand=role`
    );
    let {title,categoryId,content} = data
    NewsFrom.current.setFieldsValue({
        title,
        categoryId
    })
    setContent(content)
  };

  const getCategory = async () => {
    const { data } = await axios.get("http://localhost:8000/categories");
    setCategory([...data]);
  };
  const next = () => {
    if (current === 0) {
      NewsFrom.current
        .validateFields()
        .then((res) => {
          setFormInfo(res);
          setCurrent(current + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (content === "" || content.trim()==='<p></p>') {
        message.error("新闻内容不能为空");
      } else {
        setCurrent(current + 1);
      }
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const handleSvae = async(auditState)=>{
    axios.patch(`http://localhost:8000/news/${params.id}`,{
      ...formInfo,
      content,
      auditState:auditState,
    }).then(res=>{
      navigate(auditState === 0 ? "/news-manage/draft" : "/audit-manage/list");
      notification.info({
        message: `通知`,
        description: `您可以到${auditState === 0 ? "草稿箱" : "审核列表"}中查看您的新闻`,
        placement:'bottomRight',
      });
    })
  }
  const items = [
    {
      title: "基本信息",
      description: "新闻标题，新闻分类",
    },
    {
      title: "新闻内容",
      description: "新闻主体内容",
    },
    {
      title: "新闻提交",
      description: "保存或提交",
    },
  ];
  return (
    <div>
      <PageHeader title="更新新闻" onBack={()=>navigate(-1)}></PageHeader>
      <Steps current={current} items={items} />
      <div style={{ margin: "50px 0" }}>
        <div className={current === 0 ? "" : style.active}>
          <Form
            name="basic"
            autoComplete="off"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 21 }}
            ref={NewsFrom}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                { required: true, message: "请输入新闻标题!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                { required: true, message: "请选择新闻分类!" },
              ]}
            >
              <Select>
                {category.map((item) => {
                  return (
                    <Option value={item.id} key={item.id}>
                      {item.title}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : style.active}>
          <NewsEditor
            getContent={(value) => {
              setContent(value);
            }}
            content = {content}
          ></NewsEditor>
        </div>
        <div className={current === 2 ? "" : style.active}></div>
      </div>
      <div className="steps-action">
        {current < items.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            下一步
          </Button>
        )}
        {current === items.length - 1 && (
          <span>
            <Button type="primary" onClick={()=>handleSvae(0)}>保存草稿箱</Button>
            <Button danger style={{ margin: "0 0 0 8px" }} onClick={()=>handleSvae(1)}>
              提交审核
            </Button>
          </span>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            上一步
          </Button>
        )}
      </div>
    </div>
  );
}

