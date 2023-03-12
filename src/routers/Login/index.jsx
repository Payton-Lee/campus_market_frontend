import React, { useState } from "react";
import { Tabs, Form, Input, Button, message, Radio } from "antd";
import { login, register } from "../../asiox.js";

import "./index.less";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loginFrom] = Form.useForm();
  const [registerFrom] = Form.useForm();
  const [key, setKey] = useState("1");
  const navigate = useNavigate();
  const onFinish = (values) => {
    login(values).then((res) => {
      if (res.status === 200) {
        window.sessionStorage.setItem("token", res.data.token);
        message.success("登录成功");
        loginFrom.resetFields();
        navigate("/home/welcome");
      } else {
        message.error(res.message);
      }
    });
  };

  const registerFinish = (values) => {
    register(values)
      .then((res) => {
        if (res.status === 201) {
          message.success(res.data.msg);
          setKey("1");
          registerFrom.resetFields();
        } else {
          message.error(res.message);
        }
      })
      .catch((e) => {
        message.error("注册失败，请重试");
      });
  };

  const getTabItem = () => {
    return [
      {
        key: "1",
        label: "登录",
        children: (
          <div style={{ padding: "20px", alignItems: "center" }}>
            <Form
              name="basic"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              style={{ maxWidth: 600 }}
              onFinish={onFinish}
              autoComplete="off"
              form={loginFrom}
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: "请输入你的用户名" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: "请输入你的密码" }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 3, span: 21 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        ),
      },
      {
        key: "2",
        label: "注册",
        children: (
          <div style={{ padding: "20px", alignItems: "center" }}>
            <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              style={{ maxWidth: 600 }}
              onFinish={registerFinish}
              autoComplete="off"
              form={registerFrom}
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[{ required: true, message: "请输入你的用户名" }]}
              >
                <Input placeholder="请输入你的用户名" />
              </Form.Item>
              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: "请输入你的密码" }]}
              >
                <Input.Password placeholder="请输入你的密码" />
              </Form.Item>
              <Form.Item
                label="重复密码"
                name="repassword"
                rules={[
                  { required: true, message: "请重复你的密码" },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("两次密码输入不一致");
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="请重复你的密码" />
              </Form.Item>
              <Form.Item
                label="邮箱"
                name="email"
                rules={[{ required: true, message: "请输入你的邮箱" }]}
              >
                <Input placeholder="请输入你的邮箱" />
              </Form.Item>
              <Form.Item
                label="性别"
                name="sex"
                rules={[{ required: true, message: "请选择你的性别" }]}
              >
                <Radio.Group>
                  <Radio value={"男"}>男</Radio>
                  <Radio value={"女"}>女</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="电话号码"
                name="telephone"
                rules={[{ required: true, message: "请输入你的电话号码" }]}
              >
                <Input placeholder="请输入你的电话号码" />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          </div>
        ),
      },
    ];
  };

  return (
    <div className="login">
      <div className="box">
        <Tabs
          tabBarGutter={50}
          activeKey={key}
          onChange={(e) => {
            setKey(e);
          }}
          size="large"
          centered
          items={getTabItem()}
        />
      </div>
    </div>
  );
}
