import React, { useState } from 'react';
import 'antd/dist/antd.css';
import axios from "axios";
import moment from "moment"; 
import {
  Button,
  message,
  Table,
} from 'antd';
import { useNavigate } from 'react-router';
import { setToken } from '../authentication/tokens';
import {useEffect} from "react"
const VendorOrder = () => {
    const arr = ["PLACED", "ACCEPTED", "COOKING", "READY FOR PICKUP", "COMPLETED", "REJECTED"];
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const reject = async (record) => {
        let s = await axios.get("/orders/reject/" + record._id);
        if (s.data.status === 0) {
            let x = orders;
            for (let i in x) {
                if (x[i]._id === record._id) {
                    x[i].status = 5;
                    break;
                }
            }
            setOrders(x);
            message.info(s.data.message);
        }
        else message.error(s.data.error);
    }    
    const nextStage = async (record) => {
        let x = orders;
        for (let i in x) {
            if (x[i]._id === record._id) {
                if (x[i].status < 3)
                    x[i].status++;
                break;
            }
        }
        setOrders(x);
        let s = await axios.get("/orders/update/" + record._id);
        if (s.data.status === 0) {
            message.success(s.data.message);
        }
        else message.error(s.data.error);
    }    
    
    const RejectButton = (props) => {
        if (props.record.status !== 0)
            return (<Button type="primary" danger disabled onClick={() => reject(props.record)}> Reject </Button>);
        else 
            return (<Button type="primary" danger onClick={() => reject(props.record)}> Reject </Button>);
    }
    const StageButton = (props) => {
        if (props.record.status >= 3) 
            return (<Button type="primary" disabled>Move to next stage</Button>)
        else 
            return (<Button type="primary" onClick={()=>nextStage(props.record)}>Move to next stage</Button>)
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
        }
        let user = await axios.post("/user/profile");
        let orders = await axios.get("/orders/vendor/" + user.data._id);
        console.log(orders);
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
                orders[i].toppings = orders[i].toppings.toString();
            }
            setOrders(orders); 
            console.log(orders);
        }
    }, []);

    const columns = [
        {
            title: 'Food Item',
            dataIndex: 'food',
            key: 'food',
            width:160,
        },
        {
            title: 'Addons',
            dataIndex: 'toppings',
            key: 'toppings',
            width:150,
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
            title: "Rating",
            dataIndex: "rating",
            key: 'rating',
            width:100,
            render: (rating) => {return rating.toFixed(2)}
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
            key: 'status',
            width:200,
            render: (status, record) => {
                return (
                <>
                <StageButton record={record}/>
                <RejectButton record={record}/>
                </>);
            }
        }
        ];
    return (
        <>
        <Table rowkey={record => record._id} dataSource={orders}  columns={columns} pagination={{ position: ["none", 'bottomRight'] }}/>
        </>
    );
}
export default VendorOrder;