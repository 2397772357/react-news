import React from "react";
import { Button, Form, Input, message } from "antd";
import "./login.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  let navigate = useNavigate();
  const onFinish = async (value) => {
    const { data } = await axios.get(
      `http://localhost:8000/users?username=${value.username}&password=${value.password}&roleState=true&_expand=role`
    );
    if(data.length === 0){
      message.error("用户名或密码错误！")
    }else{
      localStorage.setItem("token",JSON.stringify(data[0]))
      navigate('/')
    }
  };
  return (
    <div style={{ background: "rgb(35,39,65)", height: "100vh" }}>
      <div className="formContainer">
        <div className="loginTitle">全球新闻发布管理系统</div>
        <Form name="basic" onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名！" }]}
          >
            <Input
              placeholder="UserName"
              prefix={<UserOutlined></UserOutlined>}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码！" }]}
          >
            <Input.Password
              placeholder="Password"
              prefix={<LockOutlined></LockOutlined>}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
