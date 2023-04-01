import React, { useState, useEffect } from "react";
import { Input, message, Switch, Table, Modal, Tooltip, Image } from "antd";
import {
  orderList,
  getGoodsByOrderId,
  orderPay,
  orderSend,
} from "../../../asiox";
import { FolderOpenOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function Order() {
  const [current, setCurrent] = useState(1);
  const [size, setSize] = useState(10);
  const [queryInfo, setQueryInfo] = useState("");
  const [total, setTatol] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [visible, setVisible] = useState(false);
  const [orderItemList, setOrderItemList] = useState([]);
  const navigate = useNavigate();

  const getData = (current, size, queryInfo) => {
    orderList({ current, size, queryInfo }).then((res) => {
      if (res.status === 200) {
        setDataSource(res.data.records);
        setTatol(res.data.total);
        console.log(res.data.records);
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
    if (e) {
      orderPay(r.id, 1).then((res) => {
        if (res.status === 201) {
          message.success(res.data.msg);
          setDataSource(
            dataSource.map((item) => {
              if (item.id === r.id) {
                return {
                  ...item,
                  payStatus: 1,
                };
              }
              return item;
            })
          );
        }
      });
    }
  };

  const handleSendChange = (e, r) => {
    if (r.payStatus !== 1) {
      message.error("订单未付款");
    } else {
      if (e) {
        console.log(e);
        orderSend(r.id, 1).then((res) => {
          console.log(res);
          if (res.status === 201) {
            message.success(res.data.msg);
            setDataSource(
              dataSource.map((item) => {
                if (item.id === r.id) {
                  return {
                    ...item,
                    isSend: 1,
                  };
                }
                return item;
              })
            );
          }
        });
      }
    }
  };

  const handleModalOpen = (r) => {
    getGoodsByOrderId(r.id).then((res) => {
      if (res.status === 200) {
        message.success("获取订单项成功");
        setOrderItemList(res.data);
        setVisible(true);
      } else {
        message.error("获取订单项失败");
      }
    });
  };

  useEffect(() => {
    getData(current, size, queryInfo);
  }, [current, size, queryInfo]);

  const colums = [
    {
      title: "查看详情",
      dataIndex: "id",
      render: (v, r) => (
        <Tooltip title="查看订单项" trigger="hover">
          <FolderOpenOutlined
            onClick={() => {
              handleModalOpen(r);
            }}
          />
        </Tooltip>
      ),
    },
    {
      title: "序号",
      dataIndex: "id",
      render: (v, r, i) => i + 1,
    },
    {
      title: "订单号码",
      dataIndex: "orderNumber",
    },
    {
      title: "订单金额",
      dataIndex: "orderPrice",
      render: (v) => <span>￥{v.toFixed(2)}</span>,
    },
    {
      title: "是否发货",
      dataIndex: "isSend",
      render: (v, r) => (
        <Switch
          checked={v === 1}
          onClick={(e) => {
            handleSendChange(e, r);
          }}
          unCheckedChildren="否"
          checkedChildren="是"
        />
      ),
    },
    {
      title: "付款状态",
      dataIndex: "payStatus",
      render: (v, r) => (
        <Switch
          checked={v === 1}
          onClick={(e) => {
            handleStateChange(e, r);
          }}
          unCheckedChildren="未付款"
          checkedChildren="已付款"
        />
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      render: (v, r) => v.replace("T", " "),
    },
    {
      title: "修改时间",
      dataIndex: "updateTime",
      render: (v, r) => v.replace("T", " "),
    },
  ];

  const itemColunm = [
    {
      title: "序号",
      dataIndex: "id",
      render: (v, r, i) => i + 1,
    },
    {
      title: "商品名称",
      dataIndex: "goods",
    },
    {
      title: "图片",
      dataIndex: "image",
      render: (v, r) => (
        <Image
          src={`http://localhost:9999/shop/api/v1/image/${v}`}
          alt={r.goods}
          style={{
            width: 120,
            height: "100%",
          }}
        />
      ),
    },
    {
      title: "商品数量",
      dataIndex: "count",
    },
    {
      title: "商品价格",
      dataIndex: "price",
      render: (v) => <span>￥{v.toFixed(2)}</span>,
    },
    {
      title: "合计",
      dataIndex: "price",
      render: (v, r) => <span>￥{(v * r.count).toFixed(2)}</span>,
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
        rowKey={(r) => `${r.id}_${r.orderNumber}`}
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
        open={visible}
        onCancel={() => {
          setVisible(false);
          setOrderItemList([]);
        }}
        footer={null}
        width="50%"
      >
        <Table
          dataSource={orderItemList}
          rowKey={(r) => `${r.id}_${r.goods}`}
          columns={itemColunm}
          pagination={false}
        />
      </Modal>
    </div>
  );
}
