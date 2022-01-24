import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
// import {Container} from '@mui/material'
import axios from "axios";
import {
  message,
  List,
  Row,
  Col,
  Statistic,
  Grid,
  Typography
} from 'antd';
import { useNavigate } from 'react-router';
import { setToken} from '../authentication/tokens';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
var randValue = function() {
  return Math.floor(Math.random() * 255);
}
var dynamicColors = function() {
  // var r = randValue();
  // var g = randValue();
  // var b = randValue();
  return "rgb(" + randValue() + "," + randValue() + "," + randValue() + ")";
};
const StatsPage = () => {
    const [userData, setUserData] = useState(null);
    const [pending, setPending] = useState(0);
    const navigate = useNavigate();
    const [topfive, setTop] = useState([]);
    const [batchLabels, setBatchLabels] = useState([]);
    const [batchStats, setBatchStats] = useState([]);
    const [batchColors, setBatchColors] = useState([]);
    const batchData = {
      labels: batchLabels,
      datasets: [{data: batchStats, backgroundColor: batchColors, label:'Completed Orders'}]
    }
    const [ageLabels, setAgeLabels] = useState([]);
    const [ageStats, setAgeStats] = useState([]);
    const [ageColors, setAgeColors] = useState([]);
    const ageData = {
      labels: ageLabels,
      datasets: [{data: ageStats, backgroundColor: ageColors, label: 'Completed Orders'}]
    }
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      Title,
      Tooltip,
      Legend,
      ArcElement

  );
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
            let y = await axios.get("/vendor/batchwise/" + userData._id);
            setBatchLabels(y.data.labels);
            let colors = []
            for (let i in y.data.labels) {
              let x = dynamicColors();
              console.log(x);
              colors.push(x);
            }
            setBatchColors(colors);
            setBatchStats(y.data.count);
            let z = await axios.get("/vendor/agewise/" + userData._id);
            colors = []
            for (let i in z.data.labels) {
              let x = dynamicColors();
              console.log(x);
              colors.push(x);
            }
            setAgeColors(colors);
            setAgeLabels(z.data.labels);
            setAgeStats(z.data.count);
            let foods = await axios.get("/food/canteen/" + userData._id);
            foods = foods.data.food;
            let best = []
            for (let i in foods) {
                if (i === 5) break;
                let x = i;
                x++;
                best.push(x + ". " + foods[i].item_name + " Times Sold: " + foods[i].times_sold);
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
        header={<div><b>Top 5 Food Items</b></div>}
        bordered
        dataSource={topfive}
        renderItem={item => <List.Item>{item}</List.Item>}
      />

      <Row gutter={24}>
        <Col span={8}>
          <Statistic title="Orders Placed" value={userData ? userData.order_stats.placed : 0} />
        </Col>
        <Col span={8}>
          <Statistic title="Orders Pending" value={pending} />
        </Col>
        <Col span={8}>
          <Statistic title="Orders Completed" value={userData ? userData.order_stats.completed : 0} />
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
        <Typography level={1}>Batchwise distribution</Typography>
        <Bar data={batchData}/>
        </Col>
        <Col span={8}>
        <Typography level={1}>Agewise distribution</Typography>
        <Bar data={ageData}/>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
        <Typography level={1}>Batchwise distribution</Typography>
        <Doughnut data={batchData}/>
        </Col>
        <Col span={8}>
        <Typography level={1}>Agewise distribution</Typography>
        <Doughnut data={ageData}/>
        </Col>
      </Row>
    </>);
}
export default StatsPage;