import React, { useState } from 'react';
import 'antd/dist/antd.css';
import axios from "axios";
import { EditOutlined, DeleteFilled, PlusOutlined, MinusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
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
  Modal,
  Grid,
  Space
} from 'antd';
import { useNavigate } from 'react-router';
import { setToken } from '../authentication/tokens';
import {useEffect} from "react"
import { Row, Col } from 'antd';
const VendorDashboard = () => {
	const [usertype, setUserType] = useState("buyer");
    const navigate = useNavigate();
    const [foodarray, setFoodArray] = useState(null);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [showingModal, setVisibility]  = useState(false);
    const [showingModal2, setVisibility2]  = useState(false);
    const [vendorid, setVendorId] = useState(""); 
    const [update, setUpdate] = useState("");
    const [currfood, setFood] = useState("");
    useEffect(async() => {
        let decodedtoken = await axios.post("/user/info");
        let vendor = await axios.post("/user/profile");
        setVendorId(vendor.data._id);
        let response = await axios.get('/food/canteen/' + vendor.data._id);
        if (response.data.status === 1) {
            message.error(response.data.error);
        }
        else {
            setFoodArray(response.data.food);
        }
    },[vendorid, update]);
    const submit = async (values) => {
        let result = {...values, canteen: vendorid};
        if (!result.toppings) result = {...result, toppings: []}
        if (!result.tags) result = {...result, tags: []}
        let response = await axios.post("/food/register", result);
        if (response.data.status === 1) {
            message.error(response.data.error);
        }
        else {
            message.success("Food item added!");
            toggleForm();
            setUpdate(update + 1);
        }
    };
    const toggleForm = () => {
        if (showingModal === false) setVisibility(true);
        else setVisibility(false);
    }
    const toggleForm2 = () => {
        if (showingModal2 === false) setVisibility2(true);
        else setVisibility2(false);
    }
    const deleteFood = async (id) => {
        let food = await axios.delete("/food/" + id);
        if (food.data.status === 1) {
            message.error(food.data.error);
        }
        else {
            message.success("Food item deleted");
            setUpdate(update + 1);
        }
    }
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
        },
        {
            title: "Modify",
            key: "modify",
            render: (text, record) => {
                return <>
                <Button onClick={() => editFood(record)}>Edit</Button>
                <Button onClick={() => deleteFood(record._id)}>Delete</Button>
                </>
            } 
        }
    ];
    const updateFood = async (values) => {
        let response = await axios.post("/food/update/" + currfood._id, values);
        if (response.data.status === 1) {
            message.error(response.data.error);
        }
        else {
            message.success("Food item successfully updated");
        }
        setUpdate(update + 1);
        toggleForm2();
        setFood("");
    };
    const editFood = (food) => {
        setFood(food);
        form2.setFieldsValue(food);
        toggleForm2();
    }
    return (
        <>
            <Table
                    columns={columns}
                    dataSource={foodarray}
                    pagination={{ position: ["none", "none"] }}
            />
            <Button onClick={toggleForm}>
                Add Food Item
            </Button>
            <Modal visible={showingModal} title="Add Food Item" onCancel={toggleForm} okText="Create item" 
            onOk={() =>
                form
                .validateFields()
                .then((values) => {
                    form.resetFields();
                    submit(values)        
                })
                .catch((err) =>{
                    console.log(err);
                })
            }>
                <Form
                form={form}
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 14,
                }}
                layout="horizontal"
                initialValues={{
                    size: "default",
                    non_veg: false 
                }}
                requiredMark={true}

                >
                    <br/>
                    <Form.Item label="Item name" required name="item_name" rules={[{required: true, message: "Enter a name for the food item"}]} >
                        <Input placeholder="Name"/>
                    </Form.Item>
                    <Form.Item label="Price" required name="price" 
                    rules={[{required: true, message: "Enter the price"}]}>
                            <InputNumber placeholder="Price"/>
                    </Form.Item>
                    <Form.Item label="Veg/Non-veg" name="non_veg">
                        <Radio.Group  value={false}>
                            <Radio.Button value={false}>Veg</Radio.Button>
                            <Radio.Button value={true}>Non-Veg</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name='tags' label="Tags">
                                <Select mode='multiple' placeholder="Tags">
                                    <Select.Option key="COLD">Cold</Select.Option>
                                    <Select.Option key="HOT">Hot</Select.Option>
                                    <Select.Option key="SWEET">Sweet</Select.Option>
                                    <Select.Option key="SPICY">Spicy</Select.Option>
                                    <Select.Option key="DRINK">Drink</Select.Option>
                                    <Select.Option key="MEAL">Meal</Select.Option>
                                    <Select.Option key="SNACK">Snack</Select.Option>
                                </Select>
                    </Form.Item>
                    <Form.List name="toppings">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'name']}
                                            rules={[{ required: true, message: 'Enter a name for the addon' }]}
                                            wrapperCol={{
                                                offset: 6,
                                                span: 14,
                                            }}
                                        >
                                            <Input placeholder="Addon name" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'price']}
                                            rules={[{ required: true, message: 'Enter the addon\'s price' }]}
                                        >
                                            <Input placeholder="Price" />
                                        </Form.Item>
                                        <DeleteFilled onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item
                                wrapperCol={{
                                    offset: 4,
                                    span: 12,
                                }}>
                                    <Button type="dashed" onClick={() => add()} block>
                                        New Addon
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
            <Modal visible={showingModal2} title="Edit Food Item" onCancel={toggleForm2} okText="Edit item" 
            onOk={() =>
                form2
                .validateFields()
                .then((values) => {
                    form2.resetFields();
                    updateFood(values)        
                })
                .catch((err) =>{
                    console.log(err);
                })
            }>
                <Form
                form={form2}
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 14,
                }}
                layout="horizontal"
                initialValues={{
                    size: "default",
                    non_veg: false 
                }}
                requiredMark={true}

                >
                    <br/>
                    <Form.Item label="Item name" required name="item_name" rules={[{required: true, message: "Enter a name for the food item"}]} >
                        <Input placeholder="Name"/>
                    </Form.Item>
                    <Form.Item label="Price" required name="price" 
                    rules={[{required: true, message: "Enter the price"}]}>
                            <InputNumber placeholder="Price"/>
                    </Form.Item>
                    <Form.Item label="Veg/Non-veg" name="non_veg">
                        <Radio.Group  value={false}>
                            <Radio.Button value={false}>Veg</Radio.Button>
                            <Radio.Button value={true}>Non-Veg</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name='tags' label="Tags">
                                <Select mode='multiple' placeholder="Tags" value={currfood.tags}>
                                    <Select.Option key="COLD">Cold</Select.Option>
                                    <Select.Option key="HOT">Hot</Select.Option>
                                    <Select.Option key="SWEET">Sweet</Select.Option>
                                    <Select.Option key="SPICY">Spicy</Select.Option>
                                    <Select.Option key="DRINK">Drink</Select.Option>
                                    <Select.Option key="MEAL">Meal</Select.Option>
                                    <Select.Option key="SNACK">Snack</Select.Option>
                                </Select>
                    </Form.Item>
                    <Form.List name="toppings">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'name']}
                                            rules={[{ required: true, message: 'Enter a name for the addon' }]}
                                            wrapperCol={{
                                                offset: 6,
                                                span: 14,
                                            }}
                                        >
                                            <Input placeholder="Addon name" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'price']}
                                            rules={[{ required: true, message: 'Enter the addon\'s price' }]}
                                        >
                                            <Input placeholder="Price" />
                                        </Form.Item>
                                        <DeleteFilled onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item
                                wrapperCol={{
                                    offset: 4,
                                    span: 12,
                                }}>
                                    <Button type="dashed" onClick={() => add()} block>
                                        New Addon
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </> 
    );
}
export default VendorDashboard;