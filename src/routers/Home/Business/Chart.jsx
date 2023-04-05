import React, { useEffect, useState } from "react";
import EChartsReact from "echarts-for-react";
import { getSalesData } from "../../../asiox";
import { message, Table } from "antd";
import { useNavigate } from "react-router-dom";

export default function Chart() {
  const [salesData, setSalesData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getSalesData().then((res) => {
      if (res.status === 200) {
        message.success("获取销售数据成功！");
        setSalesData(res.data);
      } else {
        message.error(res.message);
        navigate("/home/welcome");
      }
    });
  }, []);

  const barChartOption = (salesDataInfo) => {
    return {
      // title: {
      //   text: "商品销售数据",
      //   textAlign: "center",
      // },
      xAxis: {
        type: "category",
        data: salesDataInfo.map((item) => item.goods),
      },
      yAxis: {
        type: "value",
      },
      toolbox: {
        tooltip: {
          show: true,
        },
      },
      tooltip: {
        show: true,
      },
      grid: {
        left: "5%",
      },
      series: [
        {
          data: salesDataInfo.map((item) => item.count),
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
        },
      ],
    };
  };

  const pieChartOption = (salesDataInfo) => {
    return {
      // title: {
      //   text: "商品销售数据",
      //   textAlign: "center",
      // },
      tooltip: {
        trigger: "item",
      },
      toolbox: {
        tooltip: {
          show: true,
        },
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          data: salesDataInfo.map((item) => ({
            value: item.count,
            name: item.goods,
          })),
          type: "pie",
          radius: "70%",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
  };

  const colunms = [
    {
      title: "序号",
      dataIndex: "index",
      render: (v, r, i) => i + 1,
    },
    {
      title: "商品名称",
      dataIndex: "goods",
    },
    {
      title: "销售数量",
      dataIndex: "count",
    },
  ];

  return (
    <div>
      <div
        style={{
          height: 395,
        }}
      >
        <Table
          bordered
          dataSource={salesData}
          columns={colunms}
          // pagination={false}
          pagination={{
            pageSize: 5,
          }}
        />
      </div>
      {salesData && salesData.length && (
        <div
          style={{
            marginTop: 20,
            textAlign: "center",
            fontWeight: 700,
            fontSize: 20,
          }}
        >
          <h3>商品销售数据柱状图</h3>
          <EChartsReact option={barChartOption(salesData)} />
          <h3>商品销售数据饼状图</h3>
          <EChartsReact option={pieChartOption(salesData)} />
        </div>
      )}
    </div>
  );
}
