import React, { useEffect, useState } from "react";
import { Table, Input, Tag, message } from "antd";
import {  useNavigate } from "react-router-dom";
import { permissionList } from "../../../asiox";

export default function PermissionList() {
  const [current, setCurrent] = useState(1);
  const [size, setSize] = useState(10);
  const [queryInfo, setQueryInfo] = useState("");
  const [total, setTatol] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const navigate = useNavigate();

  const getData = (current, size, queryInfo) => {
    permissionList({ current, size, queryInfo }).then((res) => {
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
      setQueryInfo(value.trim());
    }
  };

  useEffect(() => {
    getData(current, size, queryInfo);
  }, [current, size, queryInfo]);

  // componentDidMount() {
  //   const { current, size, queryInfo } = this.state;
  //   this.getData(current, size, queryInfo);
  // }

  const colums = [
    {
      title: "序号",
      dataIndex: "id",
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
      title: "权限类型",
      dataIndex: "type",
      render: (v) => {
        switch (v) {
          case 0:
            return <Tag color="red">系统管理权限</Tag>;
          case 1:
            return <Tag color="volcano">用户管理权限</Tag>;
          case 2:
            return <Tag color="blue">商家管理权限</Tag>;
          default:
            return <Tag color="green">消费者权限</Tag>;
        }
      },
    },
  ];

  // const { dataSource, current, size, queryInfo, total } = this.state;

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
        rowKey={(r) => r.id}
        pagination={{
          current: current,
          pageSize: size,
          total: total,
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10"],
          showTotal: () => `一共${total}条`,
          onShowSizeChange: (cur, pageSize) => {
            this.getData(cur, pageSize, queryInfo);
            setCurrent(cur);
            setSize(pageSize);
          },
          onChange: (cur) => {
            setCurrent(cur);
          },
        }}
      />
    </div>
  );
}
