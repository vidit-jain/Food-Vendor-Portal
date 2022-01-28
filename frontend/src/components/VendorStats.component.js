import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import axios from "axios";
import {
  message,
  List,
  Row,
  Col,
  Statistic
} from 'antd';
import { useNavigate } from 'react-router';
import { setToken} from '../authentication/tokens';
const StatsPage = () => {
    const [userData, setUserData] = useState(null);
    const [pending, setPending] = useState(0);
    const navigate = useNavigate();
    const [topfive, setTop] = useState([]);
    useEffect(async() =>{
        let error = setToken();
        if (error === 1) {
            message.info("Please login first");
            navigate("/login");
        }
        else {
            let decodedtoken = await axios.post("/user/info");
            if (!decodedtoken) navigate("/login");
            if (decodedtoken.data.type === "buyer") {
                message.error("This page is not for you");
                navigate("/dashboard");
            }
            setToken();
            let userData = await axios.post("/user/profile");
            userData = userData.data;
            let foods = await axios.get("/food/canteen/" + userData._id);
            foods = foods.data.food;
            let best = []
            for (let i in foods) {
                if (i === 5) break;
                best.push(foods[i].item_name + " " + foods[i].times_sold);
            }
            setUserData(userData);
            let x = await axios.get("/vendor/pending/" + userData._id);
            setPending(x.data.pending);
            setTop(best);
        }
    }, []);
    return (
    <>
    
      <List
        size="large"
        header={<div>Top 5 Food Items</div>}
        bordered
        dataSource={topfive}
        renderItem={item => <List.Item>{item}</List.Item>}
      />

      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Orders Placed" value={userData ? userData.order_stats.placed : 0} />
        </Col>
        <Col span={12}>
          <Statistic title="Orders Pending" value={pending} />
        </Col>
        <Col span={12}>
          <Statistic title="Orders Completed" value={userData ? userData.order_stats.completed : 0} />
        </Col>
      </Row>
    </>);
}
export default StatsPage;