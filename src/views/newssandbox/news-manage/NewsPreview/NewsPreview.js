import React, { useEffect, useState } from "react";
import { PageHeader } from "@ant-design/pro-components";
import { useParams } from "react-router";
import { Descriptions } from "antd";
import axios from "axios";
import moment from "moment/moment";
export default function NewsPreview() {
  const [newsInfo, setNewsInfo] = useState(null);
  const params = useParams();
  const auditList = ["未审核","审核中","已通过","未通过"]
  const publishList = ["未发布","待发布","已上线","已下线"]
  const getNewsInfo = async () => {
    const { data } = await axios.get(
      `http://localhost:8000/news/${params.id}?_expand=category&_expand=role`
    );
    setNewsInfo(data);
  };
  useEffect(() => {
    getNewsInfo();
  }, []);
  return (
    <div>
      {newsInfo && (
        <div>
          <PageHeader
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={newsInfo.category.title}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
              <Descriptions.Item label="发布时间">{
              newsInfo.publishTime?moment(newsInfo.publishTime).format('YYYY/MM/DD HH:mm:ss'):'-'
              }</Descriptions.Item>
              <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
              <Descriptions.Item label="审核状态">{auditList[newsInfo.auditState]}</Descriptions.Item>
              <Descriptions.Item label="发布状态">{publishList[newsInfo.publishState]}</Descriptions.Item>
              <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
              <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
              <Descriptions.Item label="评论数量">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <div dangerouslySetInnerHTML={{__html:newsInfo.content}} style={{border:'1px solid gray',margin:'0 24px',padding:'10px'}}></div>
        </div>
      )}
    </div>
  );
}
