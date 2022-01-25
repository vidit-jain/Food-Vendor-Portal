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
const Dashboard = () => {
	const [usertype, setUserType] = useState("buyer");
    const navigate = useNavigate();
    const [foodarray, setFoodArray] = useState(null);
    const [form] = Form.useForm();
    
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
        let user = await axios.post("/user/info");
        if (!user) {
            message.error("Your token is invalid");
        }
        setUserType(user.data.type);
        // let foodarray = await axios.get("/food");
        // if (foodarray.data.length > 0) {
        //     setFoodArray(foodarray.data);
        // }
    });
    
    return (
        <>
        {/* <BuyerInput>
            <BuyerDashboard/>
        </BuyerInput>         */}
        <VendorInput>
            <VendorDashboard/>
        </VendorInput>
        </>
    );
}
export default Dashboard;