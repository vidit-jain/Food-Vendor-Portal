import React, { useState } from 'react';
import 'antd/dist/antd.css';
import { useNavigate } from "react-router-dom"
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
} from 'antd';
axios.defaults.baseURL = "http://localhost:5000/"
const Login = () => {
	const [form] = Form.useForm();
	const [usertype, setUserType] = useState("buyer");
	const navigateto = useNavigate();
	const clearForm = () => {
		form.setFieldsValue({
			email: "",
			password: ""
		});
	}
	const onChange = (props) => {
		setUserType(props.target.value);
	}
	const onSubmit = async (event) => {
		let response = await axios.post('/auth/login', event); 
		if (response.data.status === 1) {
			let err = response.data.error
			console.error(err);
			message.error(err);
			clearForm();
			return;
		}
		else {
			console.log(response.data.status);
			let bearerToken = "Bearer " + response.data.usertoken
			window.localStorage.setItem("Authorization", bearerToken);
			axios.defaults.headers.common["Authorization"] = bearerToken;
			message.success("Login successful");
			const x = window.localStorage.getItem("Authorization");
			console.log(x);
			navigateto("/food");
		}	
	}
	return (
		<Form
		labelCol={{
			span: 4,
		}}
		wrapperCol={{
			span: 14,
		}}
		layout="horizontal"
		initialValues={{
			size: "default",
			type: "buyer"
		}}
		form={form}
		requiredMark={true}
		onFinish={onSubmit}
		>
			<Form.Item label="User Type" name="type">
				<Radio.Group onChange={onChange} value="buyer">
					<Radio.Button value={"buyer"}>Buyer</Radio.Button>
					<Radio.Button value={"vendor"}>Vendor</Radio.Button>
				</Radio.Group>
			</Form.Item>
			<Form.Item label="Email" name="email"
			 rules={[{ required: true, message: 'Enter an email address' }]}
			>
				<Input placeholder="Email"/>
			</Form.Item>
			<Form.Item label="Password" required name="password" rules={[{required: true, message: "Enter a password"}]}>
				<Input.Password placeholder="Password"/>
			</Form.Item>
			<Form.Item label="">
				<Button htmlType="submit">
					Submit
				</Button>
			</Form.Item>
	</Form>
			);
}
export default Login;