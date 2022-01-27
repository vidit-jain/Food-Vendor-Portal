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
  Grid
} from 'antd';
import { useNavigate } from 'react-router';
import { setToken } from '../authentication/tokens';
import {useEffect} from "react"
import BuyerDashboard from './BuyerDashboard.component';
import VendorDashboard from './VendorDashboard.component';
const VendorOrder = () => {
    const arr = ["PLACED", "ACCEPTED", "COOKING", "READY FOR PICKUP", "COMPLETED", "REJECTED"];
	const [usertype, setUserType] = useState("buyer");
	const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [foodarray, setFoodArray] = useState(null);
    const [form] = Form.useForm();
    const [orders, setOrders] = useState([]);
    const [update, setUpdate] = useState(0);
    const reject = async (record) => {
        let s = await axios.get("/orders/reject/" + record._id);
        message.info(s);
        setUpdate(update + 1);
    }    
    const nextStage = async (record) => {
        let s = await axios.get("/orders/update/" + record._id);
        console.log(s);
        if (s.data.status === 0) message.success(s.data.message);
        else message.error(s.data.error);
        setUpdate(update + 1);
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
        user = user.data;
        setUserType(user);
        let orders = await axios.get("/orders/vendor/" + user._id);
        console.log(orders);
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
                orders[i].toppings = orders[i].toppings.toString();
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
        width:160,
        //   sorter: (a, b) => a.name.length - b.name.length,
        //   sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        //   ellipsis: true,
        },
        {
        title: 'Addons',
        dataIndex: 'toppings',
        key: 'toppings',
        width:150,
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
            title: "Rating",
            dataIndex: "rating",
            key: 'rating',
            width:100,
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