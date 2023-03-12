import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Input,
  Button,
  Tooltip,
  Popconfirm,
  message,
  Modal,
  Form,
  Checkbox,
} from "antd";
import {
  FormOutlined,
  DeleteOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  roleList,
  deleteRole,
  editRole,
  addRole,
  getRolePermissionList,
  getCurrentRolePermission,
  setCurrentRolePermission,
} from "../../../asiox";

export default function Role() {
  const [current, setCurrent] = useState(1);
  const [size, setSize] = useState(10);
  const [queryInfo, setQueryInfo] = useState("");
  const [total, setTatol] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [rolePermissionObj, setRolePermissionObj] = useState({});
  const [rolePermissionList, setRolePermissionList] = useState([]);
  const [roleInfo, setRoleInfo] = useState({});
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [editRolePermissionVisible, setEditRolePermissionVisible] =
    useState(false);
  const [currentRole, setCurrentRole] = useState(0);
  const [currentType, setCurrentType] = useState([]);
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const navigate = useNavigate();

  const getData = (current, size, queryInfo) => {
    roleList({ current, size, queryInfo }).then((res) => {
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

  const deleteCurrentRole = (r) => {
    deleteRole(r.id)
      .then((res) => {
        if (res.status === 201) {
          message.success(res.data.msg);
          setDataSource(dataSource.filter((item) => item.id !== r.id));
        } else {
          message.error(res.data.msg);
        }
      })
      .catch(() => {
        message.error("出错了，请重试");
      });
  };

  const handleEditModalOpen = (r) => {
    editForm.setFieldsValue(r);
    setRoleInfo(r);
    setEditVisible(true);
  };

  const handleEditOk = () => {
    editForm
      .validateFields()
      .then((role) => {
        editRole({
          ...roleInfo,
          ...role,
        })
          .then((res) => {
            if (res.status === 201) {
              message.success(res.data.msg);
              setEditVisible(false);
              setDataSource(
                dataSource.map((item) => {
                  if (item.id === roleInfo.id) {
                    return {
                      ...roleInfo,
                      ...role,
                    };
                  }
                  return item;
                })
              );
            } else {
              message.error("修改角色失败，请重试！");
            }
          })
          .catch((e) => {
            message.error("修改角色失败，请重试！");
          });
      })
      .catch((e) => {
        message.error("请输入有效的角色信息");
      });
  };

  const handleEditCancel = () => {
    setRoleInfo({});
    setEditVisible(false);
    setAddVisible(false);
  };

  const handleAddModalOpen = () => {
    setAddVisible(true);
  };

  const handleAddOk = () => {
    addForm
      .validateFields()
      .then((res) => {
        addRole(res)
          .then((result) => {
            if (result.status === 201) {
              message.success("添加角色成功！");
              setDataSource([...dataSource, res]);
              setAddVisible(false);
              addForm.setFieldValue({
                name: "",
                description: "",
              });
            } else {
              message.error("添加角色失败！");
              setAddVisible(false);
            }
          })
          .catch((e) => {
            message.error("添加角色失败！");
            setAddVisible(false);
          });
      })
      .catch((e) => {
        message.error("请输入有效的角色信息");
      });
  };

  const handlePermissionModalOpen = (r) => {
    setCurrentRole(r.id);
    Promise.all([getRolePermissionList(), getCurrentRolePermission(r.id)]).then(
      (res) => {
        if (res[0].status === 200 && res[1].status === 200) {
          const [{ data: permissionList }, { data: rolePermission }] = res;
          let permissionObj = {};
          permissionList.forEach((item) => {
            const currentList = permissionObj[item.type];
            if (currentList) {
              permissionObj[item.type] = [...currentList, item];
            } else {
              permissionObj[item.type] = [item];
            }
          });
          setRolePermissionObj(permissionObj);
          if (rolePermission.length) {
            setCurrentType([rolePermission[0].type]);
          } else {
            setCurrentType([]);
          }
          setRolePermissionList(
            rolePermission.map((item) => item.permissionId)
          );
        }
      }
    );
    setEditRolePermissionVisible(true);
  };

  const handlePermissionOk = () => {
    setCurrentRolePermission(currentRole, rolePermissionList.join(","))
      .then((res) => {
        if (res.status === 201) {
          message.success(res.data.msg);
        } else {
          message.error("角色分配权限失败");
        }
        setEditRolePermissionVisible(false);
      })
      .catch((e) => {
        message.error("角色分配权限失败");
      });
  };

  const handlePermissionCancel = () => {
    setEditRolePermissionVisible(false);
  };

  const getPermissionLabel = (type) => {
    switch (type) {
      case "0":
        return "系统管理员";
      case "1":
        return "用户管理员";
      case "2":
        return "商户管理";
      default:
        return "普通用户";
    }
  };

  const handleCheckBoxChange = (e, type) => {
    setRolePermissionList(e);
    setCurrentType([parseInt(type)]);
    if (e.length === 0) {
      setCurrentType([]);
    }
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
      title: "权限名称",
      dataIndex: "name",
    },
    {
      title: "权限描述",
      dataIndex: "description",
    },
    {
      title: "操作",
      dataIndex: "description",
      render: (v, r) => (
        <div>
          <Tooltip title="角色授权">
            <Button
              onClick={() => {
                handlePermissionModalOpen(r);
              }}
              style={{ color: "orange" }}
              size="small"
            >
              <SettingOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="编辑角色">
            <Button
              onClick={() => {
                handleEditModalOpen(r);
              }}
              style={{ marginLeft: 10 }}
              type="primary"
              size="small"
            >
              <FormOutlined />
            </Button>
          </Tooltip>
          <Tooltip title="删除角色">
            <Popconfirm
              // title="Delete the task"
              description="确定要删除这个角色吗"
              onConfirm={() => {
                deleteCurrentRole(r);
              }}
              okText="确认"
              cancelText="取消"
            >
              <Button
                style={{ marginLeft: 10 }}
                type="primary"
                danger
                size="small"
              >
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Tooltip>
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
      <Button
        style={{ marginLeft: 10 }}
        onClick={handleAddModalOpen}
        type="primary"
      >
        新增角色
      </Button>
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
        title="编辑角色信息"
        open={editVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="编辑"
        cancelText="取消"
      >
        <Form form={editForm}>
          <Form.Item
            label="角色名称"
            wrapperCol={{ offset: 4, span: 20 }}
            rules={[{ required: true, message: "请输入角色名称" }]}
            name="name"
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            label="角色描述"
            wrapperCol={{ offset: 4, span: 20 }}
            rules={[{ required: true, message: "请输入角色描述" }]}
            name="description"
          >
            <Input.TextArea placeholder="请输入角色描述" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="新增角色"
        open={addVisible}
        onOk={handleAddOk}
        onCancel={handleEditCancel}
        okText="新增"
        cancelText="取消"
      >
        <Form form={addForm}>
          <Form.Item
            label="角色名称"
            wrapperCol={{ offset: 4, span: 20 }}
            rules={[{ required: true, message: "请输入角色名称" }]}
            name="name"
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            label="角色描述"
            wrapperCol={{ offset: 4, span: 20 }}
            rules={[{ required: true, message: "请输入角色描述" }]}
            name="description"
          >
            <Input.TextArea placeholder="请输入角色描述" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="角色授权撤权"
        open={editRolePermissionVisible}
        onOk={handlePermissionOk}
        onCancel={handlePermissionCancel}
        okText="修改"
        cancelText="取消"
        width="80%"
      >
        {Object.keys(rolePermissionObj).map((item) => (
          <div key={item}>
            <div
              style={{
                fontSize: 16,
                marginBottom: 10,
                marginTop: 20,
              }}
            >
              {getPermissionLabel(item)}
            </div>
            <Checkbox.Group
              style={{
                display: "flex",
                justifyContent: "flex-start",
                flexWrap: "wrap",
              }}
              onChange={(e) => {
                handleCheckBoxChange(e, item);
              }}
              value={rolePermissionList}
            >
              {rolePermissionObj[item].map((value) => (
                <Checkbox
                  value={value.id}
                  key={value.id}
                  disabled={
                    !currentType.includes(value.type) &&
                    currentType.length !== 0
                  }
                  style={{
                    marginLeft: 0,
                    marginRight: 10,
                  }}
                >
                  {value.name}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </div>
        ))}
      </Modal>
    </div>
  );
}
