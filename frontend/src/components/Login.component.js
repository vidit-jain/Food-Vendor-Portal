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
import {GoogleLogin} from "react-google-login"
axios.defaults.baseURL = "http://localhost:5000/"
const Login = () => {
	const [form] = Form.useForm();
	const navigateto = useNavigate();
	const clearForm = () => {
		form.setFieldsValue({
			email: "",
			password: ""
		});
	}
	const onSubmit = async (event) => {
		let response = await axios.post('/auth/login', event); 
		if (response.data.status === 1) {
			let err = response.data.error
			message.error(err);
			clearForm();
			return;
		}
		else {
			let bearerToken = "Bearer " + response.data.usertoken
			window.localStorage.setItem("Authorization", bearerToken);
			axios.defaults.headers.common["Authorization"] = bearerToken;
			message.success("Login successful");
			const x = window.localStorage.getItem("Authorization");
			navigateto("/dashboard");
		}	
	}
	const handleGoogle = async (data) => {
		let j = {token: data.tokenId};
		let response = await axios.post("/auth/google", j);
		if (response.data.status === 1) {
			let err = response.data.error
			message.error(err);
			clearForm();
			return;
		}
		else {
			let bearerToken = "Bearer " + response.data.usertoken
			window.localStorage.setItem("Authorization", bearerToken);
			axios.defaults.headers.common["Authorization"] = bearerToken;
			message.success("Login successful");
			const x = window.localStorage.getItem("Authorization");
			navigateto("/dashboard");
		}
	} 
	return (
		<Form
		labelCol={{
			span: 4,
		}}
		wrapperCol={{
			span: 8,
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
			<br/>
			<Form.Item label="Email" name="email"
			 rules={[{ required: true, message: 'Enter an email address' }]}
			>
				<Input placeholder="Email"/>
			</Form.Item>
			<Form.Item label="Password" required name="password" rules={[{required: true, message: "Enter a password"}]}>
				<Input.Password placeholder="Password"/>
			</Form.Item>
			<Form.Item label=""
			wrapperCol={{
				offset: 4,
				span: 16,
			  }}>
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
				<GoogleLogin
					clientId={process.env.REACT_APP_GOOG_ID}
					buttonText="Log in with Google"
					onSuccess={handleGoogle}
					onFailure={handleGoogle}
					cookiePolicy={'single_host_origin'}
				/>

			</Form.Item>
	</Form>
			);
}
export default Login;