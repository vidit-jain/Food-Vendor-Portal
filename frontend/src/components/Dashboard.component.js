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
  Table
} from 'antd';
import { useNavigate } from 'react-router';
import { setToken } from '../authentication/tokens';
import {useEffect} from "react"
const BuyerDashboard = () => {
	const [usertype, setUserType] = useState("buyer");
    const navigate = useNavigate();
    const [foodarray, setFoodArray] = useState(null);
    const [form] = Form.useForm();
    
    useEffect(async() => {
        let err = setToken(); 
        if (err === 1) {
            message.error("You aren't logged in");
            navigate("/login");
        }
        let foodarray = await axios.get("/food");
        if (foodarray.data.length > 0) {
            setFoodArray(foodarray.data);
        }
    });
    const columns = [
        {
          title: 'Name',
          dataIndex: 'item_name',
          key: 'item_name',
        //   sorter: (a, b) => a.name.length - b.name.length,
        //   sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        //   ellipsis: true,
        },
        {
          title: 'Vendor',
          dataIndex: 'canteen',
          key: 'canteen',
        //   sorter: (a, b) => a.name.length - b.name.length,
        //   sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        //   ellipsis: true,
        },
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
          sorter: (a, b) => a.price - b.price,
        //   sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
        },
        {
            title: "Veg/Non-Veg",
            dataIndex: 'non_veg',
            key: 'non_veg',
            render: (non_veg) => {
                return <>{non_veg ? "Non-Veg" : "Veg"}</>
            }
        },
        {
            title: "Rating",
            dataIndex: "rating",
            key: 'rating',
            sorter: (a, b) => a.rating - b.rating,
        }
    ];
    return (
        <Table
                columns={columns}
                dataSource={foodarray}
                pagination={{ position: ["none", "none"] }}
            />
    )
}
export default BuyerDashboard;