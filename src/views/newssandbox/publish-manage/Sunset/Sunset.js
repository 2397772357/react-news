import { Button } from "antd";
import React from "react";
import NewsPublish from "../../../../components/NewsPublish/NewsPublish";
import usePublish from "../usePublish";

export default function Sunset() {
  const {dataSource,handleuDelete} = usePublish(3)
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button danger onClick={()=>{handleuDelete(id)}}>删除</Button>} ></NewsPublish>
    </div>
  )
}