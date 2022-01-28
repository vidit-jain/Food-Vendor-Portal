import React, { useState } from 'react';
import 'antd/dist/antd.css';
import axios from "axios";
import moment from "moment"; 
import {
  Button,
  Radio,
  message,
  Table,
  Rate,
  Typography
} from 'antd';
import { useNavigate } from 'react-router';
import { setToken } from '../authentication/tokens';
import {useEffect} from "react"
const BuyerOrder= () => {
    const arr = ["PLACED", "ACCEPTED", "COOKING", "READY FOR PICKUP", "COMPLETED", "REJECTED"];
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    const [update, setUpdate] = useState(0);
    const nextStage = async (record) => {
        let s = await axios.get("/orders/update/" + record._id);
        message.info(s);
        setUpdate(update + 1);
    }    
    const ratingUpdate = async (params, record) => {
        let t = {rating: params};
        let a = await axios.post("/orders/update/rating/" + record._id, t);
        if (a.data.status === 1) message.error(a.data.error);
        else {
            message.success("Rating successfully updated");
            setUpdate(update + 1);
        }
    }
    const StageButton = (props) => {
        if (props.record.status === 4) {
            return (<Button type="primary" disabled>Picked Up</Button>)
        }
        else if (props.record.status !== 3) 
            return (<Button type="primary" disabled>Pick Up</Button>)
        else 
            return (<Button type="primary" onClick={()=>nextStage(props.record)}>Pick Up</Button>)
    }
    const RateOrder = (props) => {
        if (props.record.status !== 4) {
            return (<Typography> You cannot rate orders which are not completed</Typography>)
        }
        else {
            return (<Rate defaultValue={props.record.rating} onChange={(params) => ratingUpdate(params,props.record)}/>);
        }
    }
    useEffect(async() => {
        let err = setToken(); 
        if (err === 1) {
            message.error("You aren't logged in");
            navigate("/login");
        }
        let usertoken = await axios.post("/user/info");
        if (!usertoken) {
            message.error("Your token is invalid");
            navigate("/login");
        }
        let user = await axios.post("/user/profile");
        user = user.data;
        let orders = await axios.get("/orders/buyer/" + user._id);
        if (orders.data.status === 1) {
            message.error(orders.data.error);
        }
        else {
            orders = orders.data.orders; 
            orders.sort((a, b) => Date.parse(b.placed_time) - Date.parse(a.placed_time));
            for (let i in orders) {
                orders[i].placed_time = moment(orders[i].placed_time).format("MMM Do YY HH:mm");
                let food = await axios.get("/food/" + orders[i].food);
                let canteen = await axios.get("/vendor/" + food.data.canteen);
                orders[i].food = food.data.item_name;
                orders[i].canteen = canteen.data.vendor.shop_name;
            }
            setOrders(orders); 
            console.log(orders);
        }
    }, [update]);

    const columns = [
        {
            title: 'Food Item',
            dataIndex: 'food',
            key: 'food',
            width:225,
        },
        {
            title: 'Vendor',
            dataIndex: 'canteen',
            key: 'canteen',
            width:180,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width:100,
        },
        {
            title: 'Cost',
            dataIndex: 'cost',
            key: 'cost',
            width:100,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width:100,
            render: (status) => {
                return arr[status]
            }
        },
        {
            title: "Ordered at",
            dataIndex: "placed_time",
            key: 'placed_time',
            width:200,
        },
        {
            title: "Actions",
            dataIndex: "status",
            key: "status",
            width:200,
            render: (status, record) => {
                return <StageButton record={record}/>
            }
        },
        {
            title: "Rate",
            dataIndex: "rating",
            key: "rating",
            width: 200,
            render: (status, record) => {
                return <RateOrder record={record}/>
            }
        }
        
        ];
    return (
        <>
            <Table rowkey={record => record._id} dataSource={orders}  columns={columns} pagination={{ position: ["none", 'bottomRight'] }}/>
        </>
    );
}
export default BuyerOrder;