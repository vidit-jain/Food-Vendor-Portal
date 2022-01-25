import React, { useState } from 'react';
import 'antd/dist/antd.css';
import axios from "axios";
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
const BuyerOrder= () => {
	const [usertype, setUserType] = useState("buyer");
	const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [foodarray, setFoodArray] = useState(null);
    const [form] = Form.useForm();
    const [orders, setOrders] = useState([]);
    
	const BuyerInput = (props) => {
			if (usertype === "buyer") {
					return props.children;            
			}
			return null;
	}
	const VendorInput = (props) => {
			if (usertype === "vendor") {
					return props.children;            
			}
			return null;
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
        let orders = await axios.post("/orders/user/" + user._id);
        if (orders.data.status === 1) {
            message.error(orders.data.error);
        }
        else {
            setOrders(orders.data.orders); 
        }
    }, []);
    
    return (
        <>
        <Button>hel</Button>
        </>
    );
}
export default BuyerOrder;