import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Input,
  Button,
  message,
  Modal,
  Form,
  Switch,
  Select,
} from "antd";

import { ManOutlined, WomanOutlined, SettingOutlined } from "@ant-design/icons";

import {
  userList,
  editUserState,
  userRole,
  roleName,
  editUserRole,
} from "../../../asiox";

import moment from "moment";

export default function User() {
  const [current, setCurrent] = useState(1);
  const [size, setSize] = useState(10);
  const [queryInfo, setQueryInfo] = useState("");
  const [total, setTatol] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [editVisible, setEditVisible] = useState(false);
  const [userId, setUserId] = useState(0);
  const [selectOption, setSelectOption] = useState([]);
  const [editForm] = Form.useForm();

  const navigate = useNavigate();

  const getData = (current, size, queryInfo) => {
    userList({ current, size, queryInfo }).then((res) => {
      if (res.status === 200) {
        setDataSource(res.data.records);
        setTatol(res.data.total);
      } else {
        message.error(res.message);
        navigate("/home/welcome");
      }
    });
  };

  const onSearch = (e) => {
    if (e.trim() !== "") {
      setQueryInfo(e.trim());
    }
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    if (value.trim() === "") {
      setQueryInfo(value);
    }
  };

  const handleStateChange = (e, r) => {
    editUserState(r.id, e ? 1 : 0)
      .then((res) => {
        if (res.status === 201) {
          message.success(res.data.msg);
          const { user } = res.data;
          setDataSource(
            dataSource.map((item) => {
              if (item.id === user.id && item.username === user.username) {
                return user;
              }
              return item;
            })
          );
        } else {
          message.error(res.message);
          setDataSource(
            dataSource.map((item) => {
              if (item.id === r.id && item.username === r.username) {
                return r;
              }
              return item;
            })
          );
        }
      })
      .catch(() => {
        setDataSource(
          dataSource.map((item) => {
            if (item.id === r.id && item.username === r.username) {
              return r;
            }
            return item;
          })
        );
        message.error("更新用户状态失败！");
      });
  };

  const handleEditChange = (v) => {
    editUserRole(userId, v)
      .then((res) => {
        if (res.status === 201) {
          message.success(res.data.msg);
          const { user } = res.data;
          setDataSource(
            dataSource.map((item) => {
              if (item.id === user.id && item.username === user.username) {
                return user;
              }
              return item;
            })
          );
        } else {
          message.error(res.message);
        }
        editForm.resetFields();
        setEditVisible(false);
      })
      .catch((e) => {
        message.error("系统出错，请重试！");
      });
  };

  const handlEidtModalOpen = (r) => {
    Promise.all([userRole(r.id), roleName()]).then((res) => {
      const [{ data: userRoleInfo }, { data: roleList }] = res;
      if (userRoleInfo) {
        editForm.setFieldsValue({
          username: userRoleInfo.username,
          role: userRoleInfo.role,
          roleId: userRoleInfo.roleId,
        });
      } else {
        editForm.setFieldsValue({
          username: r.username,
        });
      }
      if (roleList.length) {
        setSelectOption(roleList);
      }
      setUserId(r.id);
    });
    setEditVisible(true);
  };

  const handleEditCancel = () => {
    setEditVisible(false);
  };

  useEffect(() => {
    getData(current, size, queryInfo);
  }, [current, size, queryInfo]);

  const colums = [
    {
      title: "序号",
      dataIndex: "id",
      render: (v, r, i) => i + 1,
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "性别",
      dataIndex: "sex",
      render: (v) =>
        v === "男" ? (
          <ManOutlined style={{ color: "blue" }} />
        ) : (
          <WomanOutlined style={{ color: "pink" }} />
        ),
    },
    {
      title: "电话号码",
      dataIndex: "telephone",
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      render: (v) => v.replace("T", " "),
    },
    {
      title: "修改时间",
      dataIndex: "updateTime",
      render: (v) =>
        v ? moment(v.replace("T", " ")).format("YYYY-MM-DD HH:mm:ss") : "--",
    },
    {
      title: "状态",
      dataIndex: "state",
      render: (v, r) => (
        <Switch
          checked={v === 1}
          onClick={(e) => {
            handleStateChange(e, r);
          }}
        />
      ),
    },
    {
      title: "分配角色",
      dataIndex: "updateTime",
      render: (v, r) => (
        <div>
          <Button
            onClick={() => {
              handlEidtModalOpen(r);
            }}
            type="primary"
          >
            <SettingOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Input.Search
        placeholder="请输入搜索选项"
        onSearch={onSearch}
        onChange={onChange}
        enterButton
        style={{ width: 400 }}
      />
      <Table
        style={{ marginTop: "20px" }}
        columns={colums}
        dataSource={dataSource}
        rowKey={(r) => `${r.id}_${r.name}`}
        pagination={{
          current: current,
          pageSize: size,
          total: total,
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10"],
          showTotal: () => `一共${total}条`,
          onShowSizeChange: (cur, pageSize) => {
            setCurrent(cur);
            setSize(pageSize);
          },
          onChange: (cur) => {
            setCurrent(cur);
          },
        }}
      />
      <Modal
        title="修改用户角色"
        open={editVisible}
        onCancel={handleEditCancel}
        footer={null}
      >
        <Form form={editForm}>
          <Form.Item label="用户名称" wrapperCol={{ span: 20 }} name="username">
            <Input placeholder="请输入角色名称" readOnly />
          </Form.Item>
          <Form.Item label="角色名称" wrapperCol={{ span: 20 }} name="role">
            <Input placeholder="暂未分配角色，请点击下拉框分配" readOnly />
          </Form.Item>
          <Form.Item
            label="角色分配"
            wrapperCol={{ span: 20 }}
            // rules={[{ required: true, message: "请输入角色描述" }]}
            name="roleId"
          >
            <Select onChange={handleEditChange}>
              {selectOption.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
