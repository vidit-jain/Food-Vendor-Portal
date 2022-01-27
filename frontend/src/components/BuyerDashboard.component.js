import React, { useState } from 'react';
import 'antd/dist/antd.css';
import axios from "axios";
import isEqual from 'lodash.chunk';
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
  Tag,
  Row,
  Col,
  Checkbox,
  Slider,
  Switch,
  Modal
} from 'antd';
import { useNavigate } from 'react-router';
import { setToken } from '../authentication/tokens';
import {useEffect} from "react"


const BuyerDashboard = () => {
	const [buyerid, setBuyer] = useState("");
	const [usertype, setUserType] = useState("buyer");
    const navigate = useNavigate();
    const [foodarray, setFoodArray] = useState([]);
    const [form] = Form.useForm();
    const [foodupdate, setFoodUpdate] = useState([]); 
    const [non_veg, setVeg] = useState(true);
    const [update, setUpdate] = useState(0);
    const [vendorList, setVendorList] = useState([])
    const [tagList, setTagList] = useState([]);
    const [selectedVendors, setSelectedVendors] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedVendors2, setSelectedVendors2] = useState([]);
    const [selectedTags2, setSelectedTags2] = useState([]);
    const [searchterm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState([0,200]);
    const [allVendors, setAllVendors] = useState([]);
    const [buyerFavouriteItems, setBuyerFavouriteItems] = useState([]);
    const [buyerFavoriteJson, setFavoriteJson] = useState([]);
    const [available, setAvailable] = useState([]);
    const [unavailable, setUnavailable] = useState([]);
    const [favorites, setFavorites] = useState(false);
    const [userData, setUserData] = useState({});
    const [orderModalVisible, setOrderModalVisible] = useState(false)
    const [orderRecord, setOrderRecord] = useState([])
    const [allToppings, setAllToppings] = useState([]);
    const [selectedToppings, setSelectedToppings] = useState([])
    const [selectedToppingsPrice, setSelectedToppingsPrice] = useState([])
    const [quantity, setQuantity] = useState(1);
    // const [orderTotal, setOrderTotal] = useState(0)
    // const [toppingTotal, setToppingTotal] = useState(0);
    const [basecost, setBase] = useState(0);
    const SingleTopping = (props)=>{

        return (
            <>
                <Form.Item label={props.topping.name} name={props.topping.name}>
                    <Switch onChange={props.onSelect}/>
                </Form.Item>
            </>
        )
    }

    const updateSearch = (props) => {
        setSearchTerm(props.target.value);
    }    
    const toggleVeg = () => {
        if (non_veg) setVeg(false);
        else setVeg(true);
    }
    const toggleFavorite = (param) => {
        console.log(param.target.checked)
        navigate("/favorites");
        // if (favorites) setFavorites(false);
        // else setFavorites(true);
    }
    const toggleModal = () => {
        if (orderModalVisible) setOrderModalVisible(false);
        else {
            form.setFieldsValue({quantity: 1});
            setOrderModalVisible(true);
        }
    }
    const markedAsFavourite = async (record, param) => {
        let favourites = buyerFavouriteItems;
        let favouritesJSON = buyerFavoriteJson;
        if(param){
            favourites.push(record._id);
            setBuyerFavouriteItems(favourites)
            favouritesJSON.push(record);
        }else{
            favourites.splice(favourites.indexOf(record._id),1)
            for (let i in favouritesJSON) {
                if (record._id === favouritesJSON[i]._id){
                    favouritesJSON.splice(i ,1);
                    break;
                }
            }
            setFavoriteJson(favouritesJSON);
            setBuyerFavouriteItems(favourites)
        }
        console.log(favouritesJSON);
        let response = await axios.post("/buyer/favorite/" + record._id);
        if (response.data.status === 1) {
            message.error(response.data.error);
        }
    }
    useEffect(async() => {
        let err = setToken(); 
        let profile = await axios.post("/user/profile");
        setBuyer(profile.data._id); 
        let foodarray = await axios.get("/food");
        if (foodarray.data.status === 1) {
            message.error(foodarray.data.error);
        }
        else {
            setFoodArray(foodarray.data.food);
        }
    }, []);
    useEffect(async() => {
        setFoodUpdate([]);
        let temp = []
        let vendorset = []
        let vendorList = []
        let tagset = []
        for (let i in foodarray) {
            const food = foodarray[i];
            let vendor = await axios.get("/vendor/" + food.canteen);
            if(!Object.keys(vendorList).includes(vendor.data.vendor.shop_name)){
                vendorList[vendor.data.vendor.shop_name] = vendor.data.vendor;
            }
            let updated = food;
            updated.canteen = vendor.data.vendor.shop_name;
            let q = await axios.get("/food/rate/" + food._id);
            updated.rating = q.data;
            temp.push(updated);
            let filter = {text: updated.canteen, value: updated.canteen};
            let flag = true;
            for (let j in vendorset) {
                if (JSON.stringify(filter) === JSON.stringify(vendorset[j])){
                    flag = false;
                    break;
                }
            }
            if (flag === true) vendorset.push(filter);
            for (let j in updated.tags) {
                let filter2 = {text: updated.tags[j], value: updated.tags[j]}
                let flag = true
                for (let k in tagset) {
                    if (JSON.stringify(filter2) === JSON.stringify(tagset[k])){
                        flag = false;
                        break;
                    }
                }
                if (flag) tagset.push(filter2);
            }
        }
        // Favorite implementation
        setToken();
        let userData = await axios.post("/user/profile");
        userData = userData.data;
        setUserData(userData);
        setBuyerFavouriteItems(userData.favorites);
        let x = [];
        for (let i in userData.favorites) {
            let y = userData.favorites[i];
            let z = await axios.get("/food/" + y);
            x.push(z.data);
        }
        console.log(x);
        setFavoriteJson(x); 
        setTagList(tagset);
        setVendorList(vendorset);
        setAllVendors(vendorList)
        let a = []
        let b = []
        for (let i in temp) {
            let openTime = new Date().setHours(vendorList[temp[i].canteen].canteen_timings.open.split(":")[0], vendorList[temp[i].canteen].canteen_timings.open.split(":")[1]);
            let closeTime = new Date().setHours(vendorList[temp[i].canteen].canteen_timings.close.split(":")[0], vendorList[temp[i].canteen].canteen_timings.close.split(":")[1]);
            var now = new Date();
            // now.setHours(3,5,0);
            if(now >= openTime && now < closeTime) {
                temp[i].available = 1;
                a.push(temp[i]);    
            } else {
                temp[i].available = 0;
                b.push(temp[i]);
            }
        }
        setFoodUpdate(temp);
        setAvailable(a);
        setUnavailable(b);

    }, [foodarray, buyerFavouriteItems])
    const onChange = (pagination, filters) => {
        setSelectedVendors(filters.canteen);
        setSelectedTags(filters.tags);
    }
    const onChange2 = (pagination, filters) => {
        setSelectedVendors2(filters.canteen);
        setSelectedTags2(filters.tags);
    }
    function letsOrder(record){
        setOrderRecord(record)
        setBase(record.price);
        toggleModal();
        let top = []
        Object.keys(record.toppings).forEach(
            function(topping){
                top.push(<SingleTopping topping={record.toppings[topping]} onSelect={param => toppingSelection(param, record.toppings[topping], record)}/>)
            }
        )
        setAllToppings(top);
    }
    const submit = async (values) => {
        const x = {wallet: - quantity * basecost};
        let response = await axios.post("/user/wallet/update", x);
        if (response.data.status === 1) {
            message.error(response.data.error);
        }
        else {
            const placed_time = new Date();
            const buyer = buyerid;
            const food = orderRecord._id;
            const cost = quantity * basecost;
            const toppings = selectedToppings;
            const j = {
                placed_time,
                buyer,
                food,
                quantity, 
                cost,
                toppings
            }
            console.log(j)
            let response = await axios.post("/orders/register", j);
            if (response.data.status === 1) {
                message.error(response.data.error);
            }
            else message.success("Order placed");
        }
    }
    function toppingSelection(param, topping, record){
        let temp = selectedToppings;
        let temp2 = selectedToppingsPrice;
        if(param){
            temp.push(topping.name);
            temp2.push(topping.price);
        }else{
            let x = selectedToppings.indexOf(topping.name)
            temp.splice(x,1)
            temp2.splice(x,1)
        }
        console.log(selectedToppings)
        let cost = record.price;
        for (let i in temp2) {
            cost += temp2[i]; 
        }
        setBase(cost);
        setSelectedToppings(temp);
        setSelectedToppingsPrice(temp2);
    }
    const columns = [
        {
        title: 'Name',
        dataIndex: 'item_name',
        key: 'item_name',
        width:225,
        filteredValue: [searchterm],
        onFilter: (value, record) => record.item_name.includes(value)
        //   sorter: (a, b) => a.name.length - b.name.length,
        //   sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        //   ellipsis: true,
        },
        {
        title: 'Vendor',
        dataIndex: 'canteen',
        key: 'canteen',
        width:180,
        filters: vendorList,
        filteredValue: selectedVendors,
        onFilter: (value, record) => record.canteen.includes(value)
        //   sorter: (a, b) => a.name.length - b.name.length,
        //   sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
        //   ellipsis: true,
        },
        {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        width:100,
        sorter: {
            compare: (a, b) => {
                return a.price - b.price;
            },
            multiple: 1,
        },
        filteredValue: priceRange,
        onFilter: (value, record) => {
            return record.price >= priceRange[0] && record.price <= priceRange[1]
        }
        //   sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
        },
        {
            title: "Veg/Non-Veg",
            dataIndex: 'non_veg',
            key: 'non_veg',
            filteredValue: [non_veg],
            width:100,
            render: (non_veg) => {
                return <>{non_veg ? "Non-Veg" : "Veg"}</>
            },
            onFilter: (value, record) => (value === 'true' || !record.non_veg),
        },
        {
            title: "Rating",
            dataIndex: "rating",
            key: 'rating',
            width:100,
            sorter: (a, b) => a.rating - b.rating,
            render: (rating) => {return rating.toFixed(2)}
        },
        {
            title: "Tags",
            dataIndex: 'tags',
            key: 'tags',
            filters: tagList,
            width:250,
            filteredValue: selectedTags,
            onFilter: (value, record) => record.tags.indexOf(value) !== -1,
            render: (tags) => {
                // console.log(" heyy")
                return <>
                {
                    tags.map((tag) => {
                        return <Tag>{tag}</Tag>;
                    })
                }
                </>
            }
        },
        {
            title: "Favourite",
            dataIndex: 'Favourite',
            key: 'Favourite',
            width:160,
            filteredValue: [favorites],
            onFilter: (value, record) => {
                // console.log(value)
                return (value === 'false' || buyerFavouriteItems.indexOf(record._id) !== -1);
            }, 
            render: (order, record) => {
                let foodItem = record._id;
                // console.log(buyerFavouriteItems);
                // console.log(record)
                if(buyerFavouriteItems.includes(foodItem)){
                    // console.log(record.item_name)
                    return <><Switch defaultChecked={true} onChange={param => {markedAsFavourite(record, param)}}/></>;
                }
                else {
                    return <><Switch defaultChecked={false} onChange={param => {markedAsFavourite(record, param)}}/></>;
                }
            },
        },
        {
            title: "Place Order",
            dataIndex: 'order',
            key: 'order',
            sorter: {
                compare: (a, b) => {
                    return a.available - b.available;
                },
                multiple: 2 
            },
            render: (value,record) => {
                return <>{<Button disabled={!record.available} onClick={param => {letsOrder(record)}}>Order</Button>}</>
            },
            defaultSortOrder: 'descend' 
        }
        ];
    const clearModal = (props) => {
        setQuantity(1);
        setSelectedToppings([]);
        setSelectedToppingsPrice([]);
        setAllToppings([]);
        toggleModal();
    }
    return (
        <>
        <br/>
        <br/>
        <Row>
            <Col offset={1}>
                <Input.Search placeholder="Search food items" onChange={updateSearch} name="Search item"/>
            </Col>
            <Col offset={2}>
                <Row>
                <p>Price Range:</p>
                <Slider style={{ width:400, marginLeft:20}} range min={0} max={200} defaultValue={[0,200]} onChange={param => setPriceRange(param)}/>
                </Row>
            </Col>
            <Col offset={2}>
                <Checkbox check={!non_veg} onChange={toggleVeg}>
                    Veg-only
                </Checkbox> 
            </Col>
            <Col offset={2} >
                <Checkbox check={favorites} onChange={toggleFavorite}>
                    Favorites 
                </Checkbox> 
            </Col>
        </Row>
        <Modal visible={orderModalVisible} onCancel={clearModal}
        onOk={() => 
            form
            .validateFields()
            .then((values) => {
                form.resetFields();
                submit(values)        
                clearModal();
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
                    quantity: 1 
                }}
                requiredMark={true}

            >
            <Form.Item label="Quantity" required name="quantity" rules={[{required: true, message: "Enter a name for the food item"}]}>
                <InputNumber onChange={param => setQuantity(param)}/>                    
            </Form.Item>
            <Row>
                <p>Addons:</p>
            </Row>
            {allToppings}
            <br/>
            <br/>
            <Row>
                <p>Final Price: </p>
                {basecost * quantity}
            </Row>
            </Form>
        </Modal>
        <Table rowkey={record => record._id} dataSource={foodupdate} onChange={onChange} columns={columns} pagination={{ position: ["none", "none"] }}/>
        <br/>
        {/* <p>Unavailable</p> */}
        {/* <Table rowkey={record => record._id} dataSource={unavailable} onChange={onChange} columns={columns} pagination={{ position: ["none", "none"] }} showHeader={false}/> */}
        </>
    )
}
export default BuyerDashboard;
