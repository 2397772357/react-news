import React, { useState, useEffect, useRef } from "react";
import { Avatar, Card, Col, Row, List, Drawer } from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import * as ECharts from "echarts";
import _ from "lodash";
const { Meta } = Card;
//localhost5000/news?publishState=2&_expand=category&_sort=view&_order=desc& limit=6
export default function Home() {
  const [viewList, setViewList] = useState([]);
  const [starList, setStarList] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [pieChart, setPieChart] = useState(null);
  const [open, setOpen] = useState(false);
  const barRef = useRef();
  const pieRef = useRef();
  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    getViewList();
    getStarList();
    getBar();
    return () => {
      window.onreset = null;
    };
  }, []);

  const getViewList = async () => {
    const { data } = await axios.get(
      "http://localhost:8000/news?publishState=2&_expand=category&_sort=view&_order=desc&limit=6"
    );
    setViewList([...data]);
  };
  const getStarList = async () => {
    const { data } = await axios.get(
      "http://localhost:8000/news?publishState=2&_expand=category&_sort=star&_order=desc&limit=6"
    );
    setStarList([...data]);
  };
  const getBar = async () => {
    const { data } = await axios.get(
      "http://localhost:8000/news?publishState=2&_expand=category"
    );
    renderBar(_.groupBy(data, (item) => item.category.title));
    setNewsList(data)
  };
  const showDrawer = () => {
    setOpen(true);
    setTimeout(() => {
      renderPie()
    }, 0);
  };

  const onClose = () => {
    setOpen(false);
  };

  const renderBar = (obj) => {
    var myChart = ECharts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: "新闻分类视图",
      },
      tooltip: {},
      legend: {
        data: ["数量"],
      },
      xAxis: {
        data: Object.keys(obj),
      },
      yAxis: { minInterval: 1 },
      series: [
        {
          name: "数量",
          type: "bar",
          data: Object.values(obj).map((item) => item.length),
        },
      ],
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.onreset = () => {
      myChart.resize();
    };
  };

  const renderPie = (obj) => {
    var currentList = newsList.filter(item=>item.author === username)
    var groupObj = _.groupBy(currentList, (item) => item.category.title)
    var list = []
    for (var i in groupObj){
      list.push({
        name:i,
        value:groupObj[i].length
      })
    }
    if(!pieChart){
      var myChart = ECharts.init(pieRef.current);
      setPieChart(myChart)
    }
    let option;

    option = {
      title: {
        text: "个人新闻分类图示",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "发布数量",
          type: "pie",
          radius: "50%",
          data: list,
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

    option && myChart.setOption(option);
  };

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined
                key="setting"
                onClick={() => {
                  showDrawer();
                }}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              title={username}
              description={
                <div>
                  <b>{region ? region : "全球"}</b>
                  <span style={{ paddingLeft: "50px" }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      <Drawer
        width="500px"
        title="个人新闻分类"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <div
          ref={pieRef}
          style={{ height: "500px", marginTop: "30px", width: "100%" }}
        ></div>
      </Drawer>
      <div
        ref={barRef}
        style={{ height: "500px", marginTop: "30px", width: "80%" }}
      ></div>
    </div>
  );
}
