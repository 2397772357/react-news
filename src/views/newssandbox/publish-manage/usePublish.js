import { notification } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
function usePublish(type) {
  const [dataSource, setDataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    getPublishList();
  }, []);
  const getPublishList = async () => {
    const { data } = await axios.get(
      `http://localhost:8000/news?author=${username}&publishState=${type}&_expand=category`
    );
    setDataSource([...data]);
  };
  const handlePublish = (id) => {
    axios
      .patch(`http://localhost:8000/news/${id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到【发布管理/已发布】中查看您的新闻`,
          placement: "bottomRight",
        });
      });
    setDataSource(dataSource.filter((item) => item.id !== id));
  };
  const handleuDelete = (id) => {
    axios.delete(`http://localhost:8000/news/${id}`);
    getPublishList();
  };
  const handleSunset = (id) => {
    axios
      .patch(`http://localhost:8000/news/${id}`, { publishState: 3 })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到【发布管理/已下线】中查看您的新闻`,
          placement: "bottomRight",
        });
      });
    setDataSource(dataSource.filter((item) => item.id !== id));
  };
  return { dataSource, handlePublish, handleSunset, handleuDelete };
}

export default usePublish;
