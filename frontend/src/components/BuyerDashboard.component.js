import React, { useState } from 'react';
import 'antd/dist/antd.css';
import axios from "axios";
import fuzzy from 'fuzzy'
import {
  Form,
  Input,
  Button,
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
    const navigate = useNavigate();
    const [foodarray, setFoodArray] = useState([]);
    const [form] = Form.useForm();
    const [foodupdate, setFoodUpdate] = useState([]); 
    const [non_veg, setVeg] = useState(true);
    const [vendorList, setVendorList] = useState([])
    const [tagList, setTagList] = useState([]);
    const [selectedVendors, setSelectedVendors] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [searchterm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState([0,200]);
    const [buyerFavouriteItems, setBuyerFavouriteItems] = useState([]);
    const [buyerFavoriteJson, setFavoriteJson] = useState([]);
    const [favorites, setFavorites] = useState(false);
    const [orderModalVisible, setOrderModalVisible] = useState(false)
    const [orderRecord, setOrderRecord] = useState([])
    const [allToppings, setAllToppings] = useState([]);
    const [selectedToppings, setSelectedToppings] = useState([])
    const [selectedToppingsPrice, setSelectedToppingsPrice] = useState([])
    const [quantity, setQuantity] = useState(1);
    const [basecost, setBase] = useState(0);
    const SingleTopping = (props)=>{

        return (
            <>
                <Row>
                    <Col span={18}>
                    <Form.Item label={"Name: " + props.topping.name + " Price: ₹" + props.topping.price} name={props.topping.name} 
                    wrapperCol={{
                        span: 18,
                    }}>
                        <Switch onChange={props.onSelect}/>
                    </Form.Item>
                    </Col>
                </Row>
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
        setBuyerFavouriteItems(userData.favorites);
        let x = [];
        for (let i in userData.favorites) {
            let y = userData.favorites[i];
            let z = await axios.get("/food/" + y);
            x.push(z.data);
        }
        setFavoriteJson(x); 
        setTagList(tagset);
        setVendorList(vendorset);
        for (let i in temp) {
            let openTime = new Date().setHours(vendorList[temp[i].canteen].canteen_timings.open.split(":")[0], vendorList[temp[i].canteen].canteen_timings.open.split(":")[1]);
            let closeTime = new Date().setHours(vendorList[temp[i].canteen].canteen_timings.close.split(":")[0], vendorList[temp[i].canteen].canteen_timings.close.split(":")[1]);
            var now = new Date();
            // now.setHours(3,5,0);
            if(now >= openTime && now < closeTime) {
                temp[i].available = 1;
            } else {
                temp[i].available = 0;
            }
        }
        setFoodUpdate(temp);

    }, [foodarray, buyerFavouriteItems])
    const onChange = (pagination, filters) => {
        setSelectedVendors(filters.canteen);
        setSelectedTags(filters.tags);
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
            // onFilter: (value, record) => record.item_name.includes(value)
            onFilter: (value, record) => {
                let temp = [record.item_name]; 
                let results = fuzzy.filter(value, temp)
                let matches = results.map(function(x) { return x.string; });
                return matches.length == 1;
            } 

        },
        {
            title: 'Vendor',
            dataIndex: 'canteen',
            key: 'canteen',
            width:180,
            filters: vendorList,
            filteredValue: selectedVendors,
            onFilter: (value, record) => record.canteen.includes(value)
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
                return (value === 'false' || buyerFavouriteItems.indexOf(record._id) !== -1);
            }, 
            render: (order, record) => {
                let foodItem = record._id;
                if(buyerFavouriteItems.includes(foodItem)){
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
            render: (value, record) => {
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
                <Input.Search placeholder="Search food items (Fuzzy)" onChange={updateSearch} name="Search item"/>
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
                <Checkbox defaultChecked={false} onChange={toggleFavorite}>
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
                    span: 14,
                }}
                wrapperCol={{
                    span: 24,
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
                <p>Final Price: ₹</p>
                {basecost * quantity}
            </Row>
            </Form>
        </Modal>
        <Table rowkey={record => record._id} dataSource={foodupdate} onChange={onChange} columns={columns} pagination={{ position: ["none", "none"] }}/>
        <br/>
        </>
    )
}
export default BuyerDashboard;
