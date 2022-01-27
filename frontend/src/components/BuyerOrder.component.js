import React, { useState } from 'react';
import 'antd/dist/antd.css';
import axios from "axios";
import moment from "moment"; 
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  TimePicker,
  InputNumber,
  message,
  Table,
  Grid,
  Rate
} from 'antd';
import { useNavigate } from 'react-router';
import { setToken } from '../authentication/tokens';
import {useEffect} from "react"
import BuyerDashboard from './BuyerDashboard.component';
import VendorDashboard from './VendorDashboard.component';
const BuyerOrder= () => {
    const arr = ["PLACED", "ACCEPTED", "COOKING", "READY FOR PICKUP", "COMPLETED", "REJECTED"];
	const [usertype, setUserType] = useState("buyer");
	const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [foodarray, setFoodArray] = useState(null);
    const [form] = Form.useForm();
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
        if (props.record.status !== 3) 
            return (<Button type="primary" disabled>Picked Up</Button>)
        else 
            return (<Button type="primary" onClick={()=>nextStage(props.record)}>Picked Up</Button>)
    }
    const RateOrder = (props) => {
        if (props.record.status !== 4) {
            return (<Rate defaultValue={0} disabled/>)
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
        }
        let user = await axios.post("/user/profile");
        user = user.data;
        setUserType(user);
        let orders = await axios.get("/orders/buyer/" + user._id);
        if (orders.data.status === 1) {
            message.error(orders.data.error);
        }
        else {
            orders = orders.data.orders; 
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
        //   sorter: (a, b) => a.name.length - b.name.length,
        //   sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        //   ellipsis: true,
        },
        {
        title: 'Vendor',
        dataIndex: 'canteen',
        key: 'canteen',
        width:180,
        //   sorter: (a, b) => a.name.length - b.name.length,
        //   sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        //   ellipsis: true,
        },
        {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        width:100,
        //   sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
        },
        {
        title: 'Cost',
        dataIndex: 'cost',
        key: 'cost',
        width:100,
        //   sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
        },
        {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width:100,
        render: (status) => {
            return arr[status]
        }
        //   sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
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