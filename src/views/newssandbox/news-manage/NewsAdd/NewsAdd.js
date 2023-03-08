import React, { useState, useEffect, useRef} from "react";
import { Button, Steps, Form, Input, Select, message, notification } from "antd";
import style from "./NewAdd.module.css";
import axios from "axios";
import NewsEditor from "../../../../components/NewsEditor/NewsEditor";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

export default function NewsAdd() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [category, setCategory] = useState([]);
  const [formInfo, setFormInfo] = useState({});
  const [content, setContent] = useState("");

  const User = JSON.parse(localStorage.getItem("token"))
  const NewsFrom = useRef(null);

  useEffect(() => {
    getCategory();
  }, []);

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
    axios.post('http://localhost:8000/news',{
      ...formInfo,
      content,
      region:User.region?User.region:"全球",
      author:User.username,
      roleId:User.roleId,
      auditState:auditState,
      publishState:0,
      createTime:Date.now(),
      star:0,
      view:0,
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
      <h1 style={{ fontSize: "28px", marginLeft: "50px" }}>撰写新闻</h1>
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
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                { required: true, message: "Please input your password!" },
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
