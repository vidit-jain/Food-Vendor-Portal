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
    const [searchterm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState([0,200]);
    const [allVendors, setAllVendors] = useState([]);
    const [buyerFavouriteItems, setBuyerFavouriteItems] = useState([]);
    const updateSearch = (props) => {
        setSearchTerm(props.target.value);
    }    
    const toggleVeg = () => {
        if (non_veg) setVeg(false);
        else setVeg(true);
    }
    function markedAsFavourite(record, param){
        let favourites = buyerFavouriteItems;
        if(param){
            favourites.push(record["_id"]);
            setBuyerFavouriteItems(favourites)
        }else{
            favourites.splice(favourites.indexOf(record["_id"]),1)
            setBuyerFavouriteItems(favourites)
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
                // if (isEqual(filter, vendorset[j])) {
                    flag = false;
                    break;
                }
            }
            if (flag === true) vendorset.push(filter);
            for (let j in updated.tags) {
                let filter2 = {text: updated.tags[j], value: updated.tags[j]}
                let flag = true
                for (let k in tagset) {
                    if (JSON.stringify(filter2) === JSON.stringify(tagset[j])){
                        flag = false;
                        break;
                    }
                }
                if (flag) tagset.push(filter2);
            }
        }
        // console.log(tagset);
        // console.log(vendorset);
        setTagList(tagset);
        setVendorList(vendorset);
        setAllVendors(vendorList)
        setFoodUpdate(temp);
    }, [foodarray])
    const onChange = (pagination, filters) => {
        setSelectedVendors(filters.canteen);
        setSelectedTags(filters.tags);
    }
    const columns = [
        {
          title: 'Name',
          dataIndex: 'item_name',
          key: 'item_name',
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
          sorter: (a, b) => a.price - b.price,
          filteredValue: priceRange,
          onFilter: (value, record) => record.price >= priceRange[0] && record.price <= priceRange[1]
        //   sortOrder: sortedInfo.columnKey === 'price' && sortedInfo.order,
        },
        {
            title: "Veg/Non-Veg",
            dataIndex: 'non_veg',
            key: 'non_veg',
            filteredValue: [non_veg],
            render: (non_veg) => {
                return <>{non_veg ? "Non-Veg" : "Veg"}</>
            },
            onFilter: (value, record) => (value === 'true' || !record.non_veg),
        },
        {
            title: "Rating",
            dataIndex: "rating",
            key: 'rating',
            sorter: (a, b) => a.rating - b.rating,
        },
        {
            title: "Tags",
            dataIndex: 'tags',
            key: 'tags',
            filters: tagList,
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
            render: (order, record) => {
                let favourited = false;
                let foodItem = record["_id"]
                console.log(buyerFavouriteItems)
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
            <Col offset={2}>
                <Input.Search placeholder="Search food items" onChange={updateSearch} name="Search item"/>
            </Col>
            <Col offset={2}>
                <Row>
                <p>Price Range:</p>
                <Slider style={{ width:400, marginLeft:20}} range min={0} max={200} defaultValue={[0,200]} onChange={param => setPriceRange(param)}/>
                </Row>
            </Col>
            <Col offset={8}>
                <Checkbox check={!non_veg} onChange={toggleVeg}>
                    Veg-only
                </Checkbox> 
                <Button>Hi!</Button>
            </Col>
        </Row>
        <Table
                columns={columns}
                dataSource={foodupdate}
                pagination={{ position: ["none", "none"] }}
                onChange={onChange}
            />
        </>
    )
}
export default BuyerDashboard;