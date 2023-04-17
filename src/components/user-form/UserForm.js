import React, { forwardRef, useState, useEffect} from "react";
import { Form, Input, Select } from "antd";
const { Option } = Select;
const UserForm = forwardRef((props, ref) => {
  const { roleId, region,} = JSON.parse(
    localStorage.getItem("token")
  );
  const checkRegionDisabled = (item)=>{
    if(props.isUpdate){
      if(roleId === 1){
        return false
      }else{
        return true
      }
    }else{
      if(roleId === 1){
        return false
      }else{
        return item.value !== region
      }
    }
  }
  const checkRoleDisabled = (item)=>{
    if(props.isUpdate){
      if(roleId === 1){
        return false
      }else{
        return true
      }
    }else{
      if(roleId === 1){
        return false
      }else{
        return item.id !== 3
      }
    }
  }
  return (
    <div>
      <Form layout="vertical" ref={ref}>
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: "请输入内容！",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="用户密码"
          rules={[
            {
              required: true,
              message: "请输入内容！",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="region"
          label="区域"
          rules={
            props.isDisabled
              ? []
              : [
                  {
                    required: true,
                    message: "请选择！",
                  },
                ]
          }
        >
          <Select allowClear disabled={props.isDisabled} >
            {
              props.regionList.map(item =>
                <Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Option>
              )
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="roleId"
          label="角色"
          rules={[
            {
              required: true,
              message: "请选择！",
            },
          ]}
        >
          <Select
            allowClear
            onChange={(value) => {
              if (value === 1) {
                props.setIsDisabled(true);
                ref.current.setFieldsValue({
                  region: "",
                });
              } else {
                props.setIsDisabled(false);
              }
            }}
          >
            {
              props.roleList.map(item =>
                <Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Option>
              )
            }
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
});

export default UserForm;
