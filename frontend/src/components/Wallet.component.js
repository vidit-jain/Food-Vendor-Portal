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
const Wallet = () => {
    const [form] = Form.useForm()
    let curr_wallet;
    const navigate = useNavigate();
    const [update, setUpdate] = useState(0);
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
            if (decodedtoken.data.type === "vendor") {
                message.error("You do not have a wallet!");
                navigate("/");
            }
            setToken();
            let userData = await axios.post("/user/profile");
            userData = userData.data;
            curr_wallet = userData.wallet;
        }
    }, [update]);
	const onSubmit = async (event) => {
		let response = await axios.post('http://localhost:5000/user/wallet/update', event);
        if (response.data.status == 1) {
			message.error(response.data.error);
        }
        else {
            message.success("Wallet recharged");
            setUpdate(update + 1);
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
            <br/>
				<Form.Item label="Wallet" required name="wallet" 
				rules={[{required: true, message: "Enter an amount"}]}
                wrapperCol={{
                    span: 16,
                  }}
                >
						<InputNumber placeholder="Enter Amount"/>
				</Form.Item>
                <Form.Item label=""
                wrapperCol={{
                    offset: 4,
                    span: 16,
                  }}>
                    <Button type="primary" htmlType="submit">
                        Recharge 
                    </Button>
                </Form.Item>

	</Form>
    );
}
export default Wallet;