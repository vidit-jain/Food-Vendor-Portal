// import * as React from 'react';
import React, { Component } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import axios from 'axios';
import { red, green} from '@mui/material/colors';
const VegNonVeg = (props) => {
  if (props.non_veg) 
    return <FiberManualRecordIcon sx = {{color: red[500]}}/>;
  else 
    return <FiberManualRecordIcon sx = {{color: green[500]}}/>;
};
const FoodItem = (props) => {
return (
  <Card>
    <React.Fragment>
        <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {props.food.canteen}
        </Typography>
        <Typography variant="h5" component="div">
            {props.food.item_name} <VegNonVeg non_veg={props.food.non_veg}/> 
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
        ₹{props.food.price} 
            <StarIcon size="small"/> {props.food.rating}
        </Typography> 
        <Typography variant="body2">
        </Typography>
        </CardContent>
        <CardActions>
        <Button size="small">Learn More</Button>
        </CardActions>
    </React.Fragment>
  </Card>
  );
}
export default class FoodList extends Component {
  constructor(props) {
    super(props)
    this.state = {foodItems: []};
    // this.FoodList = this.FoodList.bind(this)
  }
  componentDidMount() {
    axios.get('http://localhost:5000/food')
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            foodItems: response.data
          })
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      })

  }
  FoodList() {
    return this.state.foodItems.map(food => {
      return <FoodItem food={food} key={food._id}/>; 
    });
  }
  render() {
    return (
      <div>
        {this.FoodList()}
      </div>
    )
  }
}