import React, { useEffect, useState } from 'react';
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
} from 'antd';
import { useNavigate } from 'react-router';
import { setToken } from '../authentication/tokens';
const Profile = () => {
    const [form] = Form.useForm()
	const [usertype, setUserType] = useState("buyer");
    const navigate = useNavigate();
    useEffect(async() =>{
        setToken();
        let decodedtoken = await axios.post("/user/info");
        if (!decodedtoken) navigate("/login");
        setUserType(decodedtoken.data.type);
        setToken();
        let userData = await axios.post("/user/profile");
        userData = userData.data;
        form.setFieldsValue({
            name: userData.name, 
            email: userData.email,
            contact_number: userData.contact_number,
            batch_name: userData.batch_name,
            age: userData.age
        });
    }, []);
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
	// const onChange = (props) => {
	// 	setUserType(props.target.value);
	// }
	const onSubmit = (event) => {
		axios.post('http://localhost:5000/auth/register', event);
	}
	return (
		<Form
        form={form}
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
		requiredMark={true}
		onFinish={onSubmit}
		>
			<Form.Item label="Name" required name="name" rules={[{required: true, message: "Enter a name"}]} >
				<Input placeholder="Name"/>
			</Form.Item>
			<Form.Item label="Password" required name="password" rules={[{required: true, message: "Enter a password"}]}>
				<Input.Password placeholder="Password"/>
			</Form.Item>
			<Form.Item label="Email" name="email"
			 rules={[{ required: true, message: 'Enter an email address' },
			  { type: 'email', message: 'Email address entered is not valid' }]}
			>
				<Input placeholder="Email"/>
			</Form.Item>
			<Form.Item label="Contact number" name="contact_number"
			 rules={[{required: true, message: "Enter your contact number"}, 
			 {len: 10, pattern:"^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$", message: "Enter a valid number"}]}>
				<Input placeholder="Contact Number"/>
			</Form.Item>

			<BuyerInput>
				<Form.Item label="Batch" required name="batch_name" rules={[{required: true, message: "Select your batch!"}]}>
						<Select placeholder="Batch">
						<Select.Option value="UG1">UG1</Select.Option>
						<Select.Option value="UG2">UG2</Select.Option>
						<Select.Option value="UG3">UG3</Select.Option>
						<Select.Option value="UG4">UG4</Select.Option>
						<Select.Option value="UG5">UG5</Select.Option>
						</Select>
				</Form.Item>
				<Form.Item label="Age" required name="age" 
				rules={[{required: true, message: "Enter your age"}]}>
						<InputNumber placeholder="age"/>
				</Form.Item>
			</BuyerInput>

			<VendorInput>
			<Form.Item label="Shop Name" required name="shop_name" rules={[{required: true, message: "Enter a shop name"}]}>
				<Input placeholder="Shop Name"/>
			</Form.Item>	
			<Form.Item label="Canteen Open Timing" required name="opentiming" rules={[{required:true, message:"Enter the canteen opening timings"}]}>
				<TimePicker format="HH:mm"/>
			</Form.Item>
			<Form.Item label="Canteen Close Timing" required name="closetiming" rules={[{required:true, message:"Enter the canteen closing timings"}]}>
				<TimePicker format="HH:mm"/>
			</Form.Item>
			</VendorInput>
			<Form.Item label="">
				<Button type="primary" htmlType="submit">
                    Update
				</Button>
			</Form.Item>
	</Form>
			);
}
export default Profile;