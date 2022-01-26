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
  Switch
} from 'antd';
import { useNavigate } from 'react-router';
import { setToken } from '../authentication/tokens';
import {useEffect} from "react"
const BuyerDashboard = () => {
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
    const [available, setAvailable] = useState([]);
    const [unavailable, setUnavailable] = useState([]);
    const [favorites, setFavorites] = useState(false);
    const [userData, setUserData] = useState(false);

    const updateSearch = (props) => {
        setSearchTerm(props.target.value);
    }    
    const toggleVeg = () => {
        if (non_veg) setVeg(false);
        else setVeg(true);
    }
    const toggleFavorite = () => {
        if (favorites) setFavorites(false);
        else setFavorites(true);
    }
    const markedAsFavourite = async (record, param) => {
        let favourites = buyerFavouriteItems;
        if(param){
            favourites.push(record._id);
            setBuyerFavouriteItems(favourites)
        }else{
            favourites.splice(favourites.indexOf(record._id),1)
            setBuyerFavouriteItems(favourites)
        }
        let response = await axios.post("/buyer/favorite/" + record._id);
        if (response.data.status === 1) {
            message.error(response.data.error);
        }
    }
    useEffect(async() => {
        let err = setToken(); 
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
        setTagList(tagset);
        setVendorList(vendorset);
        setAllVendors(vendorList)
        setFoodUpdate(temp);
        let a = []
        let b = []
        for (let i in temp) {
            let openTime = new Date().setHours(vendorList[temp[i].canteen].canteen_timings.open.split(":")[0], vendorList[temp[i].canteen].canteen_timings.open.split(":")[1]);
            let closeTime = new Date().setHours(vendorList[temp[i].canteen].canteen_timings.close.split(":")[0], vendorList[temp[i].canteen].canteen_timings.close.split(":")[1]);
            var now = new Date();
            // now.setHours(3,5,0);
            if(now >= openTime && now < closeTime) {
                a.push(temp[i]);    
            }
            else b.push(temp[i]);
        }
        setAvailable(a);
        setUnavailable(b);

    }, [foodarray])
    const onChange = (pagination, filters) => {
        setSelectedVendors(filters.canteen);
        setSelectedTags(filters.tags);
    }
    const onChange2 = (pagination, filters) => {
        setSelectedVendors2(filters.canteen);
        setSelectedTags2(filters.tags);
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
        sorter: (a, b) => a.price - b.price,
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
                return (value === 'false' || userData.favorites.indexOf(record._id) != -1);
            }, 
            render: (order, record) => {
                let favourited = false;
                let foodItem = record["_id"]
                if(buyerFavouriteItems.includes(foodItem)){
                    favourited = true;
                }
                return <><Switch defaultChecked={favourited} onChange={param => {markedAsFavourite(record, param)}}/></>
            },
        },
        {
            title: "Place Order",
            dataIndex: 'order',
            key: 'order',
            render: (order, record) => {
                let orderable = true;
                let openTime = new Date().setHours(allVendors[record.canteen].canteen_timings.open.split(":")[0], allVendors[record.canteen].canteen_timings.open.split(":")[1]);
                let closeTime = new Date().setHours(allVendors[record.canteen].canteen_timings.close.split(":")[0], allVendors[record.canteen].canteen_timings.close.split(":")[1]);
                var now = new Date();
                // now.setHours(3,5,0);
                if(now >= openTime && now < closeTime) {
                    orderable = false;
                }
                return <><Button disabled={orderable}>Order</Button></>
            },
        }
        ];
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
            <Col offset={2} check={favorites} onChange={toggleFavorite}>
                <Checkbox>
                    Favorites 
                </Checkbox> 
            </Col>
        </Row>
        <Table rowkey={record => record._id} dataSource={available} onChange={onChange} columns={columns} pagination={{ position: ["none", "none"] }}/>
        <br/>
        <p>Unavailable</p>
        <Table rowkey={record => record._id} dataSource={unavailable} onChange={onChange} columns={columns} pagination={{ position: ["none", "none"] }} showHeader={false}/>
        </>
    )
}
export default BuyerDashboard;
