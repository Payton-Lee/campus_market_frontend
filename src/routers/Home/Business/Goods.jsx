import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined,
  FileImageOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Table,
  Input,
  message,
  Switch,
  Button,
  Modal,
  Form,
  Upload,
  Image,
} from "antd";
import {
  goodsList,
  editGoodsState,
  editGoods,
  newGoods,
  addNewImage,
} from "../../../asiox";
import moment from "moment/moment";

export default function Goods() {
  const [current, setCurrent] = useState(1);
  const [size, setSize] = useState(10);
  const [queryInfo, setQueryInfo] = useState("");
  const [total, setTatol] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [goodsInfo, setGoodsInfo] = useState({});
  const [editVisible, setEditVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [showVisible, setShowVisible] = useState(false);
  const [addImageVisible, setAddImageVisible] = useState(false);
  const [image, setImage] = useState("");
  const [goodsId, setGoodsId] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

  const navigate = useNavigate();

  const getData = (current, size, queryInfo) => {
    goodsList({ current, size, queryInfo }).then((res) => {
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
    editGoodsState(r.id, e ? 1 : 0)
      .then((res) => {
        if (res.status === 201) {
          message.success(res.data.msg);
          const { goods } = res.data;
          setDataSource(
            dataSource.map((item) => {
              if (item.id === goods.id && goods.goods === item.goods) {
                return goods;
              }
              return item;
            })
          );
        } else {
          message.error(res.message);
          setDataSource(
            dataSource.map((item) => {
              if (item.id === r.id && item.goods === r.goods) {
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
            if (item.id === r.id && item.goods === r.goods) {
              return r;
            }
            return item;
          })
        );
        message.error("商品上架失败！");
      });
  };

  const editGoodsInfo = (r) => {
    setGoodsInfo(r);
    editForm.setFieldsValue(r);
    setEditVisible(true);
  };

  const handleEditOk = () => {
    editForm
      .validateFields()
      .then((goods) => {
        editGoods({ ...goodsInfo, ...goods })
          .then((res) => {
            if (res.status === 201) {
              message.success(res.data.msg);
              setEditVisible(false);
              setGoodsInfo({});
              editForm.resetFields();
              const { goods } = res.data;
              setDataSource(
                dataSource.map((item) => {
                  if (item.id === goods.id) {
                    return goods;
                  }
                  return item;
                })
              );
            } else {
              message.error("修改商品失败，请重试！");
            }
          })
          .catch((e) => {
            console.log(e);
            message.error("修改商品失败，请重试");
          });
      })
      .catch((e) => {
        message.error("请输入有效的商品信息");
      });
  };

  const handleEditCancel = () => {
    setEditVisible(false);
    editForm.resetFields();
    setGoodsInfo({});
  };

  const handleAddOk = () => {
    addForm
      .validateFields()
      .then((goods) => {
        newGoods(goods)
          .then((res) => {
            if (res.status === 201) {
              message.success(res.data.msg);
              setAddVisible(false);
              addForm.resetFields();
              const { goods } = res.data;
              const data = [...dataSource];
              data.push(goods);
              setDataSource(data);
            } else {
              message.error("添加商品失败，请重试！");
            }
          })
          .catch((e) => {
            message.error("添加商品失败，请重试");
          });
      })
      .catch((e) => {
        message.error("请输入有效的商品信息");
      });
  };

  const handleAddCancel = () => {
    setAddVisible(false);
    addForm.resetFields();
  };

  const handleShowCancel = () => {
    setShowVisible(false);
  };

  const handleAddImageCancel = () => {
    setAddImageVisible(false);
  };

  useEffect(() => {
    getData(current, size, queryInfo);
  }, [current, size, queryInfo]);

  const handleAddModalOpen = () => {
    setAddVisible(true);
  };

  const handleClickImage = (e, r) => {
    if (!r.image) {
      setGoodsId(r.id);
      setAddImageVisible(true);
    } else {
      setImage(r.image);
      setShowVisible(true);
    }
  };

  const handleChange = (e) => {
    setFileList(e.fileList);
    if (e.file.status === "done") {
      addNewImage({
        goodsId,
        image: e.file.name,
        type: 1,
      })
        .then((res) => {
          if (res.status === 201) {
            const { image } = res.data;
            setDataSource(
              dataSource.map((item) => {
                if (item.id === image.goodsId) {
                  return {
                    ...item,
                    image: image.image,
                  };
                }
                return item;
              })
            );
            message.success("添加商品图片成功！");
            setAddImageVisible(false);
            setFileList([]);
          } else {
            message.error("添加商品图片失败！请重试！");
          }
        })
        .catch((e) => {
          message.error("添加商品图片失败！请重试！");
        });
    }
  };

  const colums = [
    {
      title: "序号",
      dataIndex: "id",
      render: (v, r, i) => i + 1,
    },
    {
      title: "商品编号",
      dataIndex: "goods",
    },
    {
      title: "商品价格",
      dataIndex: "price",
    },
    {
      title: "商品库存",
      dataIndex: "inStock",
    },
    {
      title: "商品上架",
      dataIndex: "goodsState",
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
      title: "创建时间",
      dataIndex: "addTime",
      render: (v) => v.replace("T", " "),
    },
    {
      title: "修改时间",
      dataIndex: "updateTime",
      render: (v) =>
        v ? moment(v.replace("T", " ")).format("YYYY-MM-DD HH:mm:ss") : "--",
    },
    {
      title: "操作",
      dataIndex: "goods",
      width: 200,
      render: (v, r) => (
        <div>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              editGoodsInfo(r);
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            onClick={(e) => {
              handleClickImage(e, r);
            }}
            style={{ marginLeft: 10 }}
            type="primary"
            danger
            size="small"
          >
            <FileImageOutlined />
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
      <Button
        style={{ marginLeft: 10 }}
        onClick={handleAddModalOpen}
        type="primary"
      >
        新增商品
      </Button>
      <Table
        style={{ marginTop: "20px" }}
        columns={colums}
        dataSource={dataSource}
        rowKey={(r) => `${r.id}_${r.name}`}
        expandable={{
          expandedRowRender: (r) => (
            <p style={{ marginLeft: 50 }}>商品介绍：{r.goodsIntroduce}</p>
          ),
        }}
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
        title="修改商品信息"
        open={editVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="修改"
        cancelText="取消"
      >
        <Form form={editForm}>
          <Form.Item
            label="商品名称"
            wrapperCol={{ span: 20 }}
            rules={[{ required: true, message: "请输入商品名称！" }]}
            name="goods"
          >
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item
            label="商品价格"
            wrapperCol={{ span: 20 }}
            rules={[
              {
                required: true,
                message: "请输入商品价格！",
                pattern: new RegExp(/^[0-9]*$/),
              },
            ]}
            name="price"
          >
            <Input type="number" placeholder="请输入商品价格" />
          </Form.Item>
          <Form.Item
            label="商品库存"
            wrapperCol={{ span: 20 }}
            rules={[
              {
                required: true,
                message: "请输入商品库存！",
                pattern: new RegExp(/^[0-9]*$/),
              },
            ]}
            name="inStock"
          >
            <Input type="number" placeholder="请输入商品库存" />
          </Form.Item>
          <Form.Item
            label="商品介绍"
            wrapperCol={{ span: 20 }}
            rules={[{ required: true, message: "请输入商品介绍" }]}
            name="goodsIntroduce"
          >
            <Input.TextArea placeholder="请输入商品介绍" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="新增商品"
        open={addVisible}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
        okText="新增"
        cancelText="取消"
      >
        <Form form={addForm}>
          <Form.Item
            label="商品名称"
            wrapperCol={{ span: 20 }}
            rules={[{ required: true, message: "请输入商品名称！" }]}
            name="goods"
          >
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item
            label="商品价格"
            wrapperCol={{ span: 20 }}
            rules={[
              {
                required: true,
                message: "请输入商品价格！",
                pattern: new RegExp(/^[0-9]*$/),
              },
            ]}
            name="price"
          >
            <Input type="number" placeholder="请输入商品价格" />
          </Form.Item>
          <Form.Item
            label="商品库存"
            wrapperCol={{ span: 20 }}
            rules={[
              {
                required: true,
                message: "请输入商品库存！",
                pattern: new RegExp(/^[0-9]*$/),
              },
            ]}
            name="inStock"
          >
            <Input type="number" placeholder="请输入商品库存" />
          </Form.Item>
          <Form.Item
            label="商品介绍"
            wrapperCol={{ span: 20 }}
            rules={[{ required: true, message: "请输入商品介绍" }]}
            name="goodsIntroduce"
          >
            <Input.TextArea placeholder="请输入商品介绍" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="图片详情"
        open={showVisible}
        onCancel={handleShowCancel}
        footer={null}
      >
        <Image
          width={450}
          height={450}
          src={`http://localhost:9999/shop/api/v1/image/${image}`}
          alt=""
        />
      </Modal>
      <Modal
        title="添加图片"
        open={addImageVisible}
        footer={null}
        onCancel={handleAddImageCancel}
      >
        {addImageVisible ? (
          <Upload
            action="http://localhost:9999/shop/api/v1/goods/image"
            listType="picture-card"
            onChange={handleChange}
            headers={{
              Authorization: window.sessionStorage.getItem("token"),
            }}
            fileList={fileList}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>上传图片</div>
            </div>
          </Upload>
        ) : null}
      </Modal>
    </div>
  );
}
