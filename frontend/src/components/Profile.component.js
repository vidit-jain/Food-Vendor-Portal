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
  message,
} from 'antd';
import { useNavigate } from 'react-router';
import { setToken, logout } from '../authentication/tokens';
import moment from "moment";
const Profile = () => {
    const [form] = Form.useForm()
	const [usertype, setUserType] = useState("buyer");
    const [editlock, setEditing] = useState(true);
    const [old_email, setOldEmail] = useState("");
    const navigate = useNavigate();
    useEffect(async() =>{
        let error = setToken();
        console.log(error);
        if (error === 1) {
            message.info("Please login first");
            navigate("/login");
        }
        else {
            let decodedtoken = await axios.post("/user/info");
            if (!decodedtoken) navigate("/login");
            setUserType(decodedtoken.data.type);
            setToken();
            let userData = await axios.post("/user/profile");
            userData = userData.data;
            setOldEmail(userData.email);
            form.setFieldsValue({
                name: userData.name, 
                email: userData.email,
                contact_number: userData.contact_number,
            });
            if (decodedtoken.data.type === "buyer") {
                form.setFieldsValue({
                    batch_name: userData.batch_name,
                    age: userData.age
                });
            }
            else if(decodedtoken.data.type === "vendor") {
                form.setFieldsValue({
                    shop_name: userData.shop_name, 
                    opentiming: moment(userData.canteen_timings.open, "HH:mm"),
                    closetiming: moment(userData.canteen_timings.close, "HH:mm"),
                })
            }
        }
    }, []);
    const startEditing = (props) => {
        setEditing(false);
    }
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
	const onSubmit = async (event) => {
        console.log(event);
        let r = {...event, old_email: old_email, type: usertype};
        console.log(r);
		let response = await axios.post('http://localhost:5000/user/update', r);
        if (response.data.status == 1) {
			message.error("Error while registering");
        }
        else {
            if (r.email !== r.old_email) {
                logout();
                message.info("Please login with your new email id");
                navigate("/login");
            }
            else {
                message.success("Profile successfully updated");
            }
        }
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
				<Input placeholder="Name" disabled={editlock}/>
			</Form.Item>
			{/* <Form.Item label="Password" required name="password" rules={[{required: true, message: "Enter a password"}]}>
				<Input.Password placeholder="Password"/>
			</Form.Item> */}
			<Form.Item label="Email" name="email"
			 rules={[{ required: true, message: 'Enter an email address' },
			  { type: 'email', message: 'Email address entered is not valid' }]}
			>
				<Input placeholder="Email" disabled={editlock}/>
			</Form.Item>
			<Form.Item label="Contact number" name="contact_number"
			 rules={[{required: true, message: "Enter your contact number"}, 
			 {len: 10, pattern:"^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$", message: "Enter a valid number"}]}>
				<Input placeholder="Contact Number" disabled={editlock}/>
			</Form.Item>

			<BuyerInput>
				<Form.Item label="Batch" required name="batch_name" rules={[{required: true, message: "Select your batch!"}]}>
						<Select placeholder="Batch" disabled={editlock}>
						<Select.Option value="UG1">UG1</Select.Option>
						<Select.Option value="UG2">UG2</Select.Option>
						<Select.Option value="UG3">UG3</Select.Option>
						<Select.Option value="UG4">UG4</Select.Option>
						<Select.Option value="UG5">UG5</Select.Option>
						</Select>
				</Form.Item>
				<Form.Item label="Age" required name="age" 
				rules={[{required: true, message: "Enter your age"}]}>
						<InputNumber placeholder="age" disabled={editlock}/>
				</Form.Item>
			</BuyerInput>

			<VendorInput>
			<Form.Item label="Shop Name" required name="shop_name" rules={[{required: true, message: "Enter a shop name"}]}>
				<Input placeholder="Shop Name" disabled={editlock}/>
			</Form.Item>	
			<Form.Item label="Canteen Open Timing" required name="opentiming" rules={[{required:true, message:"Enter the canteen opening timings"}]}>
				<TimePicker format="HH:mm" disabled={editlock}/>
			</Form.Item>
			<Form.Item label="Canteen Close Timing" required name="closetiming" rules={[{required:true, message:"Enter the canteen closing timings"}]}>
				<TimePicker format="HH:mm" disabled={editlock}/>
			</Form.Item>
			</VendorInput>
			<Form.Item label="">
				<Button type="primary" onClick={startEditing}>
                    Edit 
				</Button>
			</Form.Item>
			<Form.Item label="">
				<Button type="primary" htmlType="submit">
                    Update
				</Button>
			</Form.Item>
	</Form>
			);
}
export default Profile;